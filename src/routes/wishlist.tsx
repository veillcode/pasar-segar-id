import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Pasar Segar" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useStore((s) => s.wishlist);
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <MobileShell>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Wishlist</h1>
          <div className="w-7" />
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <Heart className="h-14 w-14 text-muted-foreground mb-3" />
          <h2 className="font-bold text-lg">Belum ada favorit</h2>
          <p className="text-sm text-muted-foreground mt-1">Simpan produk kesukaan agar mudah dibeli nanti.</p>
          <Link to="/kategori" className="mt-5 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl">Jelajahi Produk</Link>
        </div>
      ) : (
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </MobileShell>
  );
}
