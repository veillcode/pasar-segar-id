import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { useStore } from "./store";

/**
 * Sinkronisasi keranjang & wishlist dengan database saat user login.
 * - Saat SIGNED_IN: tarik data dari DB, gabungkan dengan local, push hasilnya kembali.
 * - Saat perubahan store (login state): push delta ke DB.
 */
export function CloudSync() {
  const { user } = useAuth();
  const items = useStore((s) => s.items);
  const wishlist = useStore((s) => s.wishlist);
  const hydratedFor = useRef<string | null>(null);

  // Hydrate on login
  useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === user.id) return;
    hydratedFor.current = user.id;

    (async () => {
      const [cartRes, wishRes] = await Promise.all([
        supabase.from("cart_items").select("product_id,qty").eq("user_id", user.id),
        supabase.from("wishlist_items").select("product_id").eq("user_id", user.id),
      ]);

      const localItems = useStore.getState().items;
      const localWish = useStore.getState().wishlist;

      // Merge cart (sum qty)
      const cartMap = new Map<string, number>();
      (cartRes.data ?? []).forEach((r) => cartMap.set(r.product_id, r.qty));
      localItems.forEach((i) => cartMap.set(i.productId, (cartMap.get(i.productId) ?? 0) + i.qty));
      const mergedItems = Array.from(cartMap.entries()).map(([productId, qty]) => ({ productId, qty }));

      // Merge wishlist (union)
      const wishSet = new Set<string>([
        ...(wishRes.data ?? []).map((r) => r.product_id),
        ...localWish,
      ]);
      const mergedWish = Array.from(wishSet);

      useStore.setState({ items: mergedItems, wishlist: mergedWish });

      // Push merged state back to DB
      if (mergedItems.length) {
        await supabase.from("cart_items").upsert(
          mergedItems.map((i) => ({ user_id: user.id, product_id: i.productId, qty: i.qty })),
          { onConflict: "user_id,product_id" },
        );
      }
      if (mergedWish.length) {
        await supabase.from("wishlist_items").upsert(
          mergedWish.map((p) => ({ user_id: user.id, product_id: p })),
          { onConflict: "user_id,product_id" },
        );
      }
    })();
  }, [user]);

  // Debounced push on cart change
  useEffect(() => {
    if (!user || hydratedFor.current !== user.id) return;
    const t = setTimeout(async () => {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      if (items.length) {
        await supabase.from("cart_items").insert(
          items.map((i) => ({ user_id: user.id, product_id: i.productId, qty: i.qty })),
        );
      }
    }, 600);
    return () => clearTimeout(t);
  }, [items, user]);

  // Debounced push on wishlist change
  useEffect(() => {
    if (!user || hydratedFor.current !== user.id) return;
    const t = setTimeout(async () => {
      await supabase.from("wishlist_items").delete().eq("user_id", user.id);
      if (wishlist.length) {
        await supabase.from("wishlist_items").insert(
          wishlist.map((p) => ({ user_id: user.id, product_id: p })),
        );
      }
    }, 600);
    return () => clearTimeout(t);
  }, [wishlist, user]);

  return null;
}
