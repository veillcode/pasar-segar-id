import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Star, Minus, Plus, Shield } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { findProduct, PRODUCTS } from "@/lib/products";
import { useProductBySlug, useProducts } from "@/lib/catalog";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/produk/$slug")({
  head: ({ params }) => {
    const p = findProduct(params.slug);
    return { meta: [{ title: `${p?.name ?? "Produk"} — Pasar Segar` }, { name: "description", content: p?.description ?? "" }] };
  },
  component: ProdukDetail,
});

function ProdukDetail() {
  const { slug } = Route.useParams();
  const product = useProductBySlug(slug);
  const allProducts = useProducts();
  const [qty, setQty] = useState(1);
  const add = useStore((s) => s.add);
  const wish = useStore((s) => s.wishlist);
  const toggleWish = useStore((s) => s.toggleWish);
  const navigate = useNavigate();

  if (!product) {
    return (
      <MobileShell>
        <div className="p-8 text-center">Produk tidak ditemukan. <Link className="text-primary" to="/">Kembali</Link></div>
      </MobileShell>
    );
  }

  const isWish = wish.includes(product.id);
  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <button onClick={() => history.back()} className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="flex-1 text-center font-semibold text-base line-clamp-1">{product.name}</h1>
          <button onClick={() => toggleWish(product.id)} className="p-1.5 -mr-1.5">
            <Heart className={`h-5 w-5 ${isWish ? "fill-secondary text-secondary" : ""}`} />
          </button>
        </div>
      </header>

      <div className="bg-white aspect-square">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-xs text-muted-foreground">{product.weight} · Stok {product.stock}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-accent text-accent" /> {product.rating}
            <span className="text-xs text-muted-foreground font-normal">({product.reviews})</span>
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-primary">{rupiah(product.price)}</span>
          {product.oldPrice && <span className="text-sm text-muted-foreground line-through">{rupiah(product.oldPrice)}</span>}
        </div>
      </div>

      <div className="px-4 mt-4">
        <h3 className="font-semibold text-sm mb-1.5">Deskripsi</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      <div className="px-4 mt-4">
        <div className="bg-primary-soft rounded-xl p-3 flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-foreground">Dijamin segar — uang kembali jika tidak sesuai.</span>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h3 className="font-semibold text-base mb-3">Sering Dibeli Bersama</h3>
        <div className="grid grid-cols-2 gap-3">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <div className="h-28" />

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="phone-shell !min-h-0 !mt-0 !mb-0 !shadow-none !border-0">
          <div className="bg-white border-t border-border p-3 flex items-center gap-2">
            <div className="inline-flex items-center border border-border rounded-xl">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2.5 py-2.5"><Minus className="h-4 w-4" /></button>
              <span className="px-2.5 text-sm font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-2.5 py-2.5 text-primary"><Plus className="h-4 w-4" /></button>
            </div>
            <button
              onClick={() => { add(product.id, qty); navigate({ to: "/keranjang" }); }}
              className="flex-1 border border-primary text-primary font-semibold py-3 rounded-xl text-sm"
            >
              + Keranjang
            </button>
            <button
              onClick={() => { add(product.id, qty); navigate({ to: "/checkout" }); }}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-xl text-sm"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
