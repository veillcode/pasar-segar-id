import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, User, MapPin, Receipt, Heart, Ticket, Settings, LogOut, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/akun")({
  head: () => ({ meta: [{ title: "Akun — Pasar Segar" }] }),
  component: AkunPage,
});

const MENU = [
  { icon: User, label: "Profil Saya" },
  { icon: MapPin, label: "Alamat Saya" },
  { icon: Receipt, label: "Pesanan Saya" },
  { icon: Heart, label: "Wishlist", to: "/wishlist" as const },
  { icon: Ticket, label: "Voucher Saya" },
  { icon: Settings, label: "Pengaturan" },
];

function AkunPage() {
  return (
    <MobileShell>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Akun</h1>
          <div className="w-7" />
        </div>
      </header>

      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-lg">SA</div>
          <div className="flex-1">
            <p className="font-semibold">Siti Aisyah</p>
            <p className="text-xs text-muted-foreground">siti.aisyah@email.com</p>
          </div>
          <button className="text-xs font-semibold text-primary border border-primary rounded-lg px-3 py-1.5">Edit</button>
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-border overflow-hidden">
          {MENU.map((m, i) => {
            const Icon = m.icon;
            const content = (
              <div className={`flex items-center gap-3 px-4 py-3.5 ${i < MENU.length - 1 ? "border-b border-border" : ""}`}>
                <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                <span className="flex-1 text-sm font-medium">{m.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            );
            return m.to ? (
              <Link key={m.label} to={m.to}>{content}</Link>
            ) : (
              <button key={m.label} className="w-full text-left">{content}</button>
            );
          })}
        </div>

        <button className="mt-4 w-full bg-white border border-border rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-secondary">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </MobileShell>
  );
}
