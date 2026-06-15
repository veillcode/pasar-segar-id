import { create } from "zustand";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS as STATIC_PRODUCTS, type Product } from "./products";

export type Override = { price: number | null; stock: number | null };
export type ShippingRow = {
  key: string;
  label: string;
  description: string;
  price: number;
  sort_order: number;
};

interface CatalogState {
  overrides: Record<string, Override>;
  shipping: ShippingRow[];
  loaded: boolean;
  load: () => Promise<void>;
  setOverride: (id: string, o: Override) => void;
  setShipping: (rows: ShippingRow[]) => void;
}

const DEFAULT_SHIPPING: ShippingRow[] = [
  { key: "instan", label: "Instan (Same Day)", description: "Sampai hari ini · 08.00 - 20.00", price: 12000, sort_order: 1 },
  { key: "reguler", label: "Reguler", description: "2-3 hari kerja", price: 8000, sort_order: 2 },
  { key: "hemat", label: "Hemat", description: "3-5 hari kerja", price: 5000, sort_order: 3 },
];

export const useCatalog = create<CatalogState>((set) => ({
  overrides: {},
  shipping: DEFAULT_SHIPPING,
  loaded: false,
  load: async () => {
    const [ovRes, shRes] = await Promise.all([
      supabase.from("product_overrides").select("*"),
      supabase.from("shipping_options").select("*").order("sort_order"),
    ]);
    const overrides: Record<string, Override> = {};
    (ovRes.data ?? []).forEach((o) => {
      overrides[o.product_id] = { price: o.price, stock: o.stock };
    });
    set({
      overrides,
      shipping: shRes.data && shRes.data.length > 0 ? (shRes.data as ShippingRow[]) : DEFAULT_SHIPPING,
      loaded: true,
    });
  },
  setOverride: (id, o) =>
    set((s) => ({ overrides: { ...s.overrides, [id]: o } })),
  setShipping: (rows) => set({ shipping: rows }),
}));

export function applyOverride(p: Product, overrides: Record<string, Override>): Product {
  const o = overrides[p.id];
  if (!o) return p;
  return {
    ...p,
    price: o.price ?? p.price,
    stock: o.stock ?? p.stock,
  };
}

export function useProducts(): Product[] {
  const overrides = useCatalog((s) => s.overrides);
  return STATIC_PRODUCTS.map((p) => applyOverride(p, overrides));
}

export function useProductBySlug(slug: string): Product | undefined {
  const overrides = useCatalog((s) => s.overrides);
  const p = STATIC_PRODUCTS.find((pp) => pp.slug === slug);
  return p ? applyOverride(p, overrides) : undefined;
}

export function useShippingMap(): Record<string, { label: string; desc: string; price: number }> {
  const shipping = useCatalog((s) => s.shipping);
  const map: Record<string, { label: string; desc: string; price: number }> = {};
  shipping.forEach((s) => {
    map[s.key] = { label: s.label, desc: s.description, price: s.price };
  });
  return map;
}

export function CatalogSync() {
  const load = useCatalog((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);
  return null;
}
