import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, AlertCircle, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { FakeQR } from "@/components/FakeQR";
import { useStore } from "@/lib/store";
import { rupiah, formatDateTimeWIB } from "@/lib/format";

export const Route = createFileRoute("/pembayaran/qris")({
  head: () => ({ meta: [{ title: "Pembayaran QRIS — Pasar Segar" }] }),
  component: QrisPage,
});

function QrisPage() {
  const total = useStore((s) => s.lastOrderTotal ?? 0);
  const orderId = useStore((s) => s.lastOrderId ?? "PS-00000000-0000");
  const clear = useStore((s) => s.clear);
  const navigate = useNavigate();
  const [now] = useState(() => new Date());
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    const i = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);
  const expHH = String(expiresAt.getHours()).padStart(2, "0");
  const expMM = String(expiresAt.getMinutes()).padStart(2, "0");

  const handlePaid = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("orders").update({ status: "paid" }).eq("order_no", orderId);
    } catch {}
    clear();
    navigate({ to: "/status" });
  };

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/checkout" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Pembayaran QRIS</h1>
          <div className="w-7" />
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="bg-primary-soft rounded-2xl p-3 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-foreground">Selesaikan pembayaran dalam</p>
            <p className="text-secondary font-extrabold text-xl leading-none mt-0.5">{mm}:{ss}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="bg-white border border-border rounded-2xl p-4 text-center">
          <h2 className="font-bold text-lg">Scan QRIS untuk Membayar</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Gunakan aplikasi e-wallet atau mobile banking<br />yang mendukung QRIS</p>
          <div className="flex justify-center my-4">
            <div className="p-3 border-2 border-border rounded-2xl">
              <FakeQR value={`PASAR-SEGAR|${orderId}|${total}`} size={240} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total Pembayaran</p>
          <p className="text-3xl font-extrabold text-primary mt-1">{rupiah(total)}</p>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white border border-border rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-semibold flex items-center gap-1">{orderId} <Copy className="h-3.5 w-3.5 text-muted-foreground" /></span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Dibuat Pada</span><span>{formatDateTimeWIB(now)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Berlaku Hingga</span><span className="text-secondary font-semibold">{expHH}:{expMM} WIB (15 menit)</span></div>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-white border border-border rounded-2xl p-4">
          <p className="font-semibold text-sm mb-2">Cara bayar dengan QRIS</p>
          <ol className="space-y-2">
            {[
              "Buka aplikasi e-wallet / mobile banking",
              "Pilih menu Scan QR / QRIS",
              "Scan kode QR di atas",
              `Pastikan nominal sesuai: ${rupiah(total)}`,
              "Konfirmasi pembayaran",
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-primary-soft text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="bg-accent/15 border border-accent/40 rounded-2xl p-3 flex gap-2.5">
          <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Pastikan nominal sesuai</p>
            <p className="text-xs text-muted-foreground">Nominal QRIS harus sama dengan total pembayaran.</p>
          </div>
        </div>
      </div>

      <div className="h-28" />
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="phone-shell !min-h-0 !mt-0 !mb-0 !shadow-none !border-0">
          <div className="bg-white border-t border-border p-3 text-center">
            <button onClick={handlePaid} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl">Saya Sudah Bayar</button>
            <p className="text-xs text-muted-foreground mt-2">Butuh bantuan? <span className="text-primary font-semibold">Hubungi Kami</span></p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
