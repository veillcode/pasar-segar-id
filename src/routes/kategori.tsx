import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, type Category } from "@/lib/products";
import { z } from "zod";

const searchSchema = z.object({
  cat: z.enum(["cabai", "sayuran", "bawang", "rempah", "bumbu", "buah", "paket"]).optional(),
  sort: z.enum(["harga", "terlaris", "terbaru", "promo"]).optional(),
});

export const Route = createFileRoute("/kategori")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Kategori — Pasar Segar" }] }),
  component: KategoriPage,
});

const TABS: { id: Category; label: string }[] = [
  { id: "cabai", label: "Cabai" },
  { id: "sayuran", label: "Sayuran" },
  { id: "bawang", label: "Bawang" },
  { id: "rempah", label: "Rempah" },
  { id: "bumbu", label: "Bumbu" },
];

const SORTS = [
  { id: "harga", label: "Harga" },
  { id: "terlaris", label: "Terlaris" },
  { id: "terbaru", label: "Terbaru" },
  { id: "promo", label: "Promo" },
] as const;

function KategoriPage() {
  const { cat = "cabai", sort } = Route.useSearch();
  const navigate = useNavigate();
  const filtered = PRODUCTS.filter((p) => p.category === cat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "harga") return a.price - b.price;
    if (sort === "terlaris") return b.reviews - a.reviews;
    if (sort === "promo") return (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0);
    return 0;
  });

  return (
    <MobileShell>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Kategori</h1>
          <button className="p-1.5 -mr-1.5"><Search className="h-5 w-5" /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {TABS.map((t) => {
            const active = t.id === cat;
            return (
              <button
                key={t.id}
                onClick={() => navigate({ to: "/kategori", search: { cat: t.id, sort } })}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "bg-white border border-border text-foreground"}`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar border-t border-border pt-2.5">
          {SORTS.map((s) => {
            const active = sort === s.id;
            return (
              <button
                key={s.id}
                onClick={() => navigate({ to: "/kategori", search: { cat, sort: active ? undefined : s.id } })}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${active ? "bg-primary-soft text-primary border border-primary" : "bg-muted text-muted-foreground border border-border"}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {sorted.length === 0 && (
          <p className="col-span-2 text-center text-sm text-muted-foreground py-12">Belum ada produk di kategori ini.</p>
        )}
        {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </MobileShell>
  );
}
