import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import { rupiah, formatDateTimeWIB } from "@/lib/format";

export const Route = createFileRoute("/status")({
  head: () => ({ meta: [{ title: "Status Pembayaran — Pasar Segar" }] }),
  component: StatusPage,
});

const TIMELINE = [
  { t: "Pesanan Dibuat", desc: "" },
  { t: "Pembayaran Berhasil", desc: "" },
  { t: "Pesanan Diproses", desc: "Menunggu konfirmasi penjual" },
  { t: "Pesanan Dikirim", desc: "Menunggu paket dikirim" },
  { t: "Pesanan Selesai", desc: "Menunggu konfirmasi penerimaan" },
];

function StatusPage() {
  const orderId = useStore((s) => s.lastOrderId ?? "PS-00000000-0000");
  const total = useStore((s) => s.lastOrderTotal ?? 0);
  const items = useStore((s) => s.lastOrderItems ?? []);
  const payment = useStore((s) => s.paymentMethod);
  const now = new Date();
  const subtotal = items.reduce((sum, i) => {
    const p = PRODUCTS.find((pp) => pp.id === i.productId);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
  const ongkir = total - subtotal;

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Status Pembayaran</h1>
          <div className="w-7" />
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="bg-primary-soft rounded-2xl p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto">
            <Check className="h-9 w-9" strokeWidth={3} />
          </div>
          <h2 className="mt-3 text-xl font-bold text-primary">Pembayaran Berhasil!</h2>
          <p className="text-sm text-muted-foreground mt-1">Terima kasih, pembayaran Anda telah kami terima.</p>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white border border-border rounded-2xl p-4 space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Metode Pembayaran</span>
            <span className="font-bold uppercase">{payment}</span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Total Pembayaran</span><span className="text-primary font-bold">{rupiah(total)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Waktu Pembayaran</span><span>{formatDateTimeWIB(now)}</span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Order ID</span><span className="font-semibold flex items-center gap-1">{orderId} <Copy className="h-3.5 w-3.5 text-muted-foreground" /></span></div>
          <div className="flex justify-between items-center"><span className="text-muted-foreground">Status</span><span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-1 rounded-md">Lunas</span></div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="px-4 pt-3">
          <div className="bg-white border border-border rounded-2xl p-4">
            <p className="text-sm font-semibold mb-2.5">Ringkasan Pesanan</p>
            <div className="space-y-3">
              {items.map((i) => {
                const p = PRODUCTS.find((pp) => pp.id === i.productId)!;
                return (
                  <div key={i.productId} className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{i.qty} × {p.weight}</p>
                    </div>
                    <span className="text-sm font-semibold">{rupiah(p.price * i.qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border mt-3 pt-3 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.length} Produk)</span><span>{rupiah(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ongkos Kirim</span><span>{rupiah(ongkir)}</span></div>
              <div className="flex justify-between font-bold pt-1"><span>Total Pembayaran</span><span className="text-primary">{rupiah(total)}</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pt-3">
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold mb-3">Status Pesanan</p>
          <ol className="space-y-3">
            {TIMELINE.map((s, i) => {
              const done = i <= 1;
              return (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? "bg-primary text-white" : "border-2 border-border bg-white"}`}>
                      {done && <CheckCircle2 className="h-3 w-3" />}
                    </span>
                    {i < TIMELINE.length - 1 && <span className={`flex-1 w-px ${done ? "bg-primary" : "bg-border"} min-h-[18px]`} />}
                  </div>
                  <div className="-mt-0.5 pb-2">
                    <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>{s.t}</p>
                    <p className="text-xs text-muted-foreground">{done ? formatDateTimeWIB(now) : s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="h-28" />
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="phone-shell !min-h-0 !mt-0 !mb-0 !shadow-none !border-0">
          <div className="bg-white border-t border-border p-3 space-y-2">
            <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl">Lihat Detail Pesanan</button>
            <Link to="/" className="block w-full text-center border border-primary text-primary font-bold py-3 rounded-xl">Belanja Lagi</Link>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
