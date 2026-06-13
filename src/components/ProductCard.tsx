import { Link } from "@tanstack/react-router";
import { Star, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { rupiah } from "@/lib/format";
import { useStore } from "@/lib/store";

export function ProductCard({ product, variant = "grid" }: { product: Product; variant?: "grid" | "row" }) {
  const add = useStore((s) => s.add);

  if (variant === "row") {
    return (
      <Link
        to="/produk/$slug"
        params={{ slug: product.slug }}
        className="flex gap-3 bg-white rounded-2xl p-3 border border-border shadow-[var(--shadow-soft)]"
      >
        <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover bg-muted shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="font-semibold text-[15px] text-foreground line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{product.weight}</p>
          <p className="font-bold text-foreground mt-1">{rupiah(product.price)}<span className="text-xs font-normal text-muted-foreground">/{product.weight.split(" ")[1]}</span></p>
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {product.rating} <span>({product.reviews >= 1000 ? `${(product.reviews/1000).toFixed(1)}k` : product.reviews})</span>
            </span>
            <button
              onClick={(e) => { e.preventDefault(); add(product.id); }}
              className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Keranjang
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/produk/$slug"
      params={{ slug: product.slug }}
      className="bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)] flex flex-col"
    >
      <div className="aspect-square bg-muted">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-2.5 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1">{product.name}</h3>
        <p className="text-[11px] text-muted-foreground">{product.weight}</p>
        <p className="font-bold text-foreground mt-1 text-[15px]">{rupiah(product.price)}<span className="text-[11px] font-normal text-muted-foreground">/{product.weight.split(" ")[1]}</span></p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
          <Star className="h-3 w-3 fill-accent text-accent" />
          {product.rating} ({product.reviews >= 1000 ? `${(product.reviews/1000).toFixed(1)}k` : product.reviews})
        </div>
        <button
          onClick={(e) => { e.preventDefault(); add(product.id); }}
          className="mt-2 w-full bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Keranjang
        </button>
      </div>
    </Link>
  );
}
