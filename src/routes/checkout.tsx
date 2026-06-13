import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Check, Shield, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCartDetails, useStore, SHIPPING } from "@/lib/store";
import { rupiah, generateOrderId } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Pasar Segar" }] }),
  component: CheckoutPage,
});

const PAYMENTS = [
  { id: "cod", label: "COD (Bayar di Tempat)", icon: "💵" },
  { id: "transfer", label: "Transfer Bank", icon: "🏦" },
  { id: "qris", label: "QRIS", icon: "📱" },
  { id: "ewallet", label: "E-Wallet", icon: "💳" },
] as const;

function Step({ n, label, active, done }: { n: number; label: string; active?: boolean; done?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-primary text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border"}`}>
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </div>
      <span className={`text-[10px] font-medium ${active || done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}

function CheckoutPage() {
  const { items, subtotal, count } = useCartDetails();
  const shipping = useStore((s) => s.shippingMethod);
  const setShipping = useStore((s) => s.setShipping);
  const payment = useStore((s) => s.paymentMethod);
  const setPayment = useStore((s) => s.setPayment);
  const setLastOrder = useStore((s) => s.setLastOrder);
  const clear = useStore((s) => s.clear);
  const navigate = useNavigate();

  const ongkir = SHIPPING[shipping].price;
  const total = subtotal + ongkir;

  const handleBayar = () => {
    const orderId = generateOrderId();
    const snap = items.map((i) => ({ productId: i.productId, qty: i.qty }));
    setLastOrder(orderId, total, snap);
    if (payment === "qris") {
      navigate({ to: "/pembayaran/qris" });
    } else {
      clear();
      navigate({ to: "/status" });
    }
  };

  if (items.length === 0) {
    return (
      <MobileShell hideNav>
        <div className="p-8 text-center">Keranjang kosong. <Link className="text-primary" to="/">Belanja</Link></div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/keranjang" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Checkout</h1>
          <div className="w-7" />
        </div>
        <div className="flex items-center px-4 pb-4">
          <Step n={1} label="Alamat" done />
          <div className="flex-1 h-px bg-primary mx-1 mb-4" />
          <Step n={2} label="Pengiriman" done />
          <div className="flex-1 h-px bg-primary mx-1 mb-4" />
          <Step n={3} label="Pembayaran" active />
          <div className="flex-1 h-px bg-border mx-1 mb-4" />
          <Step n={4} label="Konfirmasi" />
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Alamat Pengiriman</p>
            <button className="text-xs font-semibold text-primary">Ubah</button>
          </div>
          <div className="bg-muted/60 rounded-xl p-3">
            <span className="font-semibold text-sm">Rumah</span>
            <p className="text-sm text-foreground mt-0.5">Jl. Melati No.15, Depok, Jawa Barat</p>
            <p className="text-xs text-muted-foreground">62812xxxxxx</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Ringkasan Pesanan</p>
            <Link to="/keranjang" className="text-xs font-semibold text-primary">Ubah</Link>
          </div>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex items-center gap-3">
                <img src={i.product.image} alt={i.product.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">{i.qty} × {i.product.weight}</p>
                </div>
                <span className="text-sm font-semibold">{rupiah(i.lineTotal)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm font-semibold mb-2">Metode Pengiriman</p>
          <div className="space-y-2">
            {(Object.keys(SHIPPING) as (keyof typeof SHIPPING)[]).map((k) => {
              const s = SHIPPING[k];
              const active = shipping === k;
              return (
                <button key={k} onClick={() => setShipping(k)} className={`w-full flex items-center gap-3 p-3 rounded-xl border ${active ? "border-primary bg-primary-soft" : "border-border"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? "border-primary" : "border-border"}`}>
                    {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <span className="text-sm font-bold">{rupiah(s.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl border border-border p-4">
          <p className="text-sm font-semibold mb-2">Pilih Metode Pembayaran</p>
          <div className="space-y-2">
            {PAYMENTS.map((p) => {
              const active = payment === p.id;
              return (
                <button key={p.id} onClick={() => setPayment(p.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl border ${active ? "border-primary bg-primary-soft" : "border-border"}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? "border-primary" : "border-border"}`}>
                    {active && <Check className="h-3 w-3 text-primary" />}
                  </span>
                  <span className="text-lg">{p.icon}</span>
                  <span className="flex-1 text-left text-sm font-medium">{p.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white rounded-2xl border border-border p-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({count} Produk)</span><span>{rupiah(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Ongkos Kirim</span><span>{rupiah(ongkir)}</span></div>
          <div className="border-t border-border pt-2 flex justify-between font-bold text-base"><span>Total Pembayaran</span><span className="text-primary">{rupiah(total)}</span></div>
        </div>
        <div className="bg-primary-soft rounded-xl p-3 mt-3 flex items-start gap-2">
          <Shield className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="text-xs font-semibold">Transaksi aman & terenkripsi</p>
            <p className="text-[11px] text-muted-foreground">Data Anda dijamin aman dengan enkripsi end-to-end.</p>
          </div>
        </div>
      </div>

      <div className="h-28" />
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="phone-shell !min-h-0 !mt-0 !mb-0 !shadow-none !border-0">
          <div className="bg-white border-t border-border p-3">
            <button onClick={handleBayar} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-between px-5">
              <span className="text-left leading-tight">
                <span className="block text-[15px]">Bayar Sekarang</span>
                <span className="block text-xs font-normal opacity-90">Total: {rupiah(total)}</span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
