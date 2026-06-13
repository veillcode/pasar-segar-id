import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "./products";

export interface CartItem {
  productId: string;
  qty: number;
}

interface State {
  items: CartItem[];
  wishlist: string[];
  shippingMethod: "instan" | "reguler" | "hemat";
  paymentMethod: "cod" | "transfer" | "qris" | "ewallet";
  lastOrderId?: string;
  lastOrderTotal?: number;
  lastOrderItems?: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  setShipping: (m: State["shippingMethod"]) => void;
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

export const SHIPPING: Record<State["shippingMethod"], { label: string; desc: string; price: number }> = {
  instan: { label: "Instan (Same Day)", desc: "Sampai hari ini · 08.00 - 20.00", price: 12000 },
  reguler: { label: "Reguler", desc: "2-3 hari kerja", price: 8000 },
  hemat: { label: "Hemat", desc: "3-5 hari kerja", price: 5000 },
};

export const useCartDetails = () => {
  const items = useStore((s) => s.items);
  const detailed = items.map((i) => {
    const p = PRODUCTS.find((pp) => pp.id === i.productId)!;
    return { ...i, product: p as Product, lineTotal: p.price * i.qty };
  });
  const subtotal = detailed.reduce((s, i) => s + i.lineTotal, 0);
  const count = detailed.reduce((s, i) => s + i.qty, 0);
  return { items: detailed, subtotal, count };
};
