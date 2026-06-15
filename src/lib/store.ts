import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "./products";
import { applyOverride, useCatalog } from "./catalog";

export interface CartItem {
  productId: string;
  qty: number;
}

interface State {
  items: CartItem[];
  wishlist: string[];
  shippingMethod: string;
  paymentMethod: "cod" | "transfer" | "qris" | "ewallet";
  lastOrderId?: string;
  lastOrderTotal?: number;
  lastOrderItems?: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  setShipping: (m: string) => void;
  setPayment: (m: State["paymentMethod"]) => void;
  setLastOrder: (id: string, total: number, items: CartItem[]) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      items: [],
      wishlist: [],
      shippingMethod: "instan",
      paymentMethod: "qris",
      add: (id, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === id);
          if (existing) {
            return { items: s.items.map((i) => i.productId === id ? { ...i, qty: i.qty + qty } : i) };
          }
          return { items: [...s.items, { productId: id, qty }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.productId !== id)
            : s.items.map((i) => i.productId === id ? { ...i, qty } : i),
        })),
      clear: () => set({ items: [] }),
      toggleWish: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),
      setShipping: (m) => set({ shippingMethod: m }),
      setPayment: (m) => set({ paymentMethod: m }),
      setLastOrder: (id, total, items) => set({ lastOrderId: id, lastOrderTotal: total, lastOrderItems: items }),
    }),
    { name: "pasar-segar-store" },
  ),
);

export const useCartDetails = () => {
  const items = useStore((s) => s.items);
  const overrides = useCatalog((s) => s.overrides);
  const detailed = items
    .map((i) => {
      const base = PRODUCTS.find((pp) => pp.id === i.productId);
      if (!base) return null;
      const product = applyOverride(base, overrides);
      return { ...i, product: product as Product, lineTotal: product.price * i.qty };
    })
    .filter((x): x is { productId: string; qty: number; product: Product; lineTotal: number } => x !== null);
  const subtotal = detailed.reduce((s, i) => s + i.lineTotal, 0);
  const count = detailed.reduce((s, i) => s + i.qty, 0);
  return { items: detailed, subtotal, count };
};
