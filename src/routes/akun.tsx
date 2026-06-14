import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, User, Receipt, Heart, LogOut, ChevronRight, Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useAuth, signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { rupiah, formatDateTimeWIB } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/akun")({
  head: () => ({ meta: [{ title: "Akun — Pasar Segar" }] }),
  component: AkunPage,
});

interface OrderRow {
  id: string;
  order_no: string;
  total: number;
  status: string;
  created_at: string;
}

function AkunPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase.from("orders").select("id,order_no,total,status,created_at").order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => setOrders(data ?? []));
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  if (loading) {
    return <MobileShell><div className="flex justify-center pt-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></MobileShell>;
  }

  if (!user) {
    return (
      <MobileShell>
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-2 px-4 py-3">
            <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
            <h1 className="flex-1 text-center font-semibold text-base">Akun</h1>
            <div className="w-7" />
          </div>
        </header>
        <div className="px-4 pt-10 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-soft flex items-center justify-center text-primary"><User className="h-10 w-10" /></div>
          <h2 className="mt-4 font-bold text-lg">Belum masuk</h2>
          <p className="text-sm text-muted-foreground mt-1">Masuk untuk melihat pesanan dan profil Anda.</p>
          <Link to="/auth" className="inline-block mt-5 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl">Masuk / Daftar</Link>
        </div>
      </MobileShell>
    );
  }

  const initials = (profile?.full_name ?? user.email ?? "U").slice(0, 2).toUpperCase();
  const STATUS_LABEL: Record<string, string> = {
    pending: "Menunggu Pembayaran", paid: "Lunas", packing: "Diproses",
    delivering: "Dikirim", completed: "Selesai", cancelled: "Dibatalkan",
  };

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
          <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center text-primary font-bold text-lg">{initials}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{profile?.full_name ?? "Pengguna"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /> Pesanan Saya</p>
            <span className="text-xs text-muted-foreground">{orders.length} pesanan</span>
          </div>
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                Belum ada pesanan
              </div>
            ) : orders.map((o, i) => (
              <div key={o.id} className={`px-4 py-3 ${i < orders.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">{o.order_no}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${o.status === "paid" || o.status === "completed" ? "bg-primary-soft text-primary" : o.status === "pending" ? "bg-accent/20 text-accent" : "bg-muted text-foreground"}`}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{formatDateTimeWIB(new Date(o.created_at))}</span>
                  <span className="font-bold text-sm text-primary">{rupiah(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/wishlist" className="mt-4 bg-white rounded-2xl border border-border px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Heart className="h-4 w-4" /></div>
          <span className="flex-1 text-sm font-medium">Wishlist</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <button onClick={async () => { await signOut(); toast.success("Berhasil logout"); navigate({ to: "/" }); }} className="mt-4 w-full bg-white border border-border rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-secondary">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </MobileShell>
  );
}
