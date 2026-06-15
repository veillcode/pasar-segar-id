import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCartDetails, useStore } from "@/lib/store";
import { useShippingMap } from "@/lib/catalog";
import { rupiah } from "@/lib/format";

export const Route = createFileRoute("/keranjang")({
  head: () => ({ meta: [{ title: "Keranjang — Pasar Segar" }] }),
  component: KeranjangPage,
});

function KeranjangPage() {
  const { items, subtotal, count } = useCartDetails();
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  const shipping = useStore((s) => s.shippingMethod);
  const shippingMap = useShippingMap();
  const ongkir = shippingMap[shipping]?.price ?? 0;
  const total = subtotal + ongkir;
  const targetFree = 100000;
  const progress = Math.min(100, (subtotal / targetFree) * 100);
  const remaining = Math.max(0, targetFree - subtotal);

  return (
    <MobileShell>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Keranjang</h1>
          <button className="text-primary text-sm font-semibold">Edit</button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl mb-3">🛒</div>
          <h2 className="font-bold text-lg">Keranjang masih kosong</h2>
          <p className="text-sm text-muted-foreground mt-1">Yuk mulai belanja sayur segar hari ini!</p>
          <Link to="/" className="mt-5 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl">Mulai Belanja</Link>
        </div>
      ) : (
        <>
          <div className="px-4 pt-3">
            <div className="bg-primary-soft rounded-2xl p-3">
              <p className="text-sm font-semibold text-foreground">
                {remaining === 0 ? "🎉 Selamat! Kamu dapat gratis ongkir" : "Yay! Ongkir kamu gratis 🎉"}
              </p>
              {remaining > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">Belanja lagi {rupiah(remaining)} untuk gratis ongkir</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{rupiah(targetFree)}</span>
              </div>
            </div>
          </div>

          <div className="px-4 pt-3">
            <p className="text-sm font-semibold mb-2">Produk ({count})</p>
            <div className="space-y-2.5">
              {items.map((i) => (
                <div key={i.productId} className="bg-white rounded-2xl border border-border p-3 flex gap-3">
                  <img src={i.product.image} alt={i.product.name} className="w-16 h-16 rounded-xl object-cover bg-muted" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{i.product.name}</h3>
                        <p className="text-xs text-muted-foreground">{i.product.weight}</p>
                        <p className="font-bold text-sm mt-1">{rupiah(i.product.price)}</p>
                      </div>
                      <button onClick={() => remove(i.productId)} className="text-secondary p-1 h-fit">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex justify-end mt-1">
                      <div className="inline-flex items-center border border-border rounded-lg">
                        <button onClick={() => setQty(i.productId, i.qty - 1)} className="px-2 py-1"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="px-3 text-sm font-semibold">{i.qty}</span>
                        <button onClick={() => setQty(i.productId, i.qty + 1)} className="px-2 py-1 text-primary"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="bg-white rounded-2xl border border-border p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{rupiah(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ongkir</span><span>{rupiah(ongkir)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">{rupiah(total)}</span></div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-background pt-3 px-4 pb-3 mt-auto">
            <Link to="/checkout" className="block w-full bg-primary text-primary-foreground text-center font-semibold py-3.5 rounded-xl">
              Checkout ({count})
            </Link>
          </div>
        </>
      )}
    </MobileShell>
  );
}
