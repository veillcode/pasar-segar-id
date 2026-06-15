import { createFileRoute, Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Truck, Leaf, Tag, ChevronRight, Star } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products";
import { useProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import heroMarket from "@/assets/hero-market.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pasar Segar — Belanja Sayur Segar Langsung dari Pasar" },
      { name: "description", content: "Cabai, sayuran, dan bumbu dapur pilihan dengan kualitas terbaik dan harga terjangkau." },
    ],
  }),
  component: Index,
});

function Index() {
  const count = useStore((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const products = useProducts();
  const bestsellers = products.filter((p) => p.bestseller).concat(products.slice(0, 8)).slice(0, 10);

  return (
    <MobileShell>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="p-1.5 -ml-1.5" aria-label="Menu"><Menu className="h-6 w-6" /></button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center text-lg">🧺</div>
            <div className="leading-tight">
              <div className="font-extrabold text-primary text-[15px] tracking-tight">PASAR SEGAR</div>
              <div className="text-[10px] text-muted-foreground -mt-0.5">Segar setiap hari</div>
            </div>
          </div>
          <Link to="/keranjang" className="relative p-1.5 -mr-1.5">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">{count}</span>
            )}
          </Link>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Cari cabai, sayur, rempah..." />
          </div>
        </div>
      </header>

      <section className="px-4 pt-2">
        <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-[var(--shadow-card)]">
          <div className="relative aspect-[16/10]">
            <img src={heroMarket} alt="Pasar sayur Indonesia" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <span className="inline-block text-[11px] font-semibold text-primary bg-primary-soft px-2.5 py-1 rounded-full">Fresh Every Day</span>
            <h1 className="mt-2 text-[22px] font-extrabold leading-tight text-foreground">
              Belanja Sayur <span className="text-primary">Segar</span><br />Langsung dari Pasar
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Cabai, sayuran, dan bumbu dapur pilihan dengan kualitas terbaik dan harga terjangkau.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link to="/kategori" className="bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl text-center">Belanja Sekarang</Link>
              <Link to="/kategori" className="border border-primary text-primary text-sm font-semibold py-2.5 rounded-xl text-center">Lihat Katalog</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { icon: Truck, label: "Pengiriman Cepat" },
            { icon: Leaf, label: "Fresh Setiap Hari" },
            { icon: Tag, label: "Harga Pasar" },
          ].map(({ icon: I, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <I className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Kategori</h2>
          <Link to="/kategori" className="text-xs font-semibold text-primary flex items-center">Lihat semua <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Link key={c.id} to="/kategori" search={{ cat: c.id }} className="flex flex-col items-center gap-1.5">
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-border">
                <img src={c.image} alt={c.label} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-[11px] font-medium text-foreground text-center leading-tight">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="rounded-2xl bg-secondary text-white p-4 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-[13px] font-semibold leading-tight">Harga Cabai Turun<br />Minggu Ini!</p>
            <p className="mt-1 text-xl font-extrabold leading-none">Diskon Hingga <span className="text-accent">20%</span></p>
            <Link to="/kategori" search={{ cat: "cabai" }} className="inline-block mt-2 bg-accent text-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg">Belanja Sekarang</Link>
          </div>
          <div className="text-6xl absolute right-3 top-1/2 -translate-y-1/2 opacity-90">🌶️</div>
        </div>
      </section>

      <section className="mt-5">
        <div className="flex items-center justify-between mb-3 px-4">
          <h2 className="text-base font-bold">Produk Terlaris</h2>
          <Link to="/kategori" className="text-xs font-semibold text-primary flex items-center">Lihat semua <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
          {bestsellers.map((p) => (
            <div key={p.id} className="w-[160px] shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-5">
        <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
          {[
            { icon: Truck, t: "Pengiriman Cepat", s: "Sampai ke rumah Anda" },
            { icon: Leaf, t: "Sayur Fresh Setiap Hari", s: "Produk segar pilihan" },
            { icon: Tag, t: "Harga Langsung Pasar", s: "Lebih hemat & terjangkau" },
            { icon: ShoppingCart, t: "Belanja Mudah", s: "Praktis dan cepat" },
          ].map(({ icon: I, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><I className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold text-sm">{t}</p>
                <p className="text-xs text-muted-foreground">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-5">
        <h2 className="text-base font-bold mb-3">Testimoni Pelanggan</h2>
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center font-bold text-primary">SA</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Siti Aisyah</p>
              <p className="text-xs text-muted-foreground">Depok</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <Star className="h-4 w-4 fill-accent text-accent" /> 5.0
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground leading-relaxed">"Sayurnya selalu segar dan pengiriman cepat. Cabainya juga lebih murah dibanding pasar sekitar rumah."</p>
        </div>
      </section>

      <div className="h-6" />
    </MobileShell>
  );
}
