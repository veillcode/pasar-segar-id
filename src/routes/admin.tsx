import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Save, Truck, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/admin";
import { useCatalog } from "@/lib/catalog";
import { PRODUCTS } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { rupiah } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Pasar Segar" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"produk" | "ongkir">("produk");
  const load = useCatalog((s) => s.load);

  useEffect(() => { load(); }, [load]);

  if (loading || checking) {
    return <MobileShell hideNav><div className="flex justify-center pt-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></MobileShell>;
  }
  if (!user) { navigate({ to: "/auth" }); return null; }
  if (!isAdmin) {
    return (
      <MobileShell hideNav>
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-2 px-4 py-3">
            <Link to="/akun" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
            <h1 className="flex-1 text-center font-semibold text-base">Admin</h1>
            <div className="w-7" />
          </div>
        </header>
        <div className="p-8 text-center text-sm text-muted-foreground">
          Akses ditolak. Hanya admin.
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/akun" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">Admin Panel</h1>
          <div className="w-7" />
        </div>
        <div className="flex gap-2 px-4 pb-3">
          <button onClick={() => setTab("produk")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold ${tab === "produk" ? "bg-primary text-primary-foreground" : "bg-white border border-border"}`}>
            <Tag className="h-4 w-4" /> Harga
          </button>
          <button onClick={() => setTab("ongkir")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold ${tab === "ongkir" ? "bg-primary text-primary-foreground" : "bg-white border border-border"}`}>
            <Truck className="h-4 w-4" /> Ongkir
          </button>
        </div>
      </header>

      {tab === "produk" ? <ProdukAdmin /> : <OngkirAdmin />}
    </MobileShell>
  );
}

function ProdukAdmin() {
  const overrides = useCatalog((s) => s.overrides);
  const setOverride = useCatalog((s) => s.setOverride);
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSave = async (id: string, price: number, stock: number) => {
    setSavingId(id);
    const { error } = await supabase.from("product_overrides").upsert({
      product_id: id, price, stock,
    }, { onConflict: "product_id" });
    setSavingId(null);
    if (error) { toast.error(error.message); return; }
    setOverride(id, { price, stock });
    toast.success("Tersimpan");
  };

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-xs text-muted-foreground">Edit harga & stok untuk setiap produk. Perubahan langsung tampil di seluruh aplikasi.</p>
      {PRODUCTS.map((p) => (
        <ProdukRow key={p.id} product={p} ov={overrides[p.id]} onSave={handleSave} saving={savingId === p.id} />
      ))}
    </div>
  );
}

function ProdukRow({ product, ov, onSave, saving }: {
  product: typeof PRODUCTS[number];
  ov?: { price: number | null; stock: number | null };
  onSave: (id: string, price: number, stock: number) => void;
  saving: boolean;
}) {
  const [price, setPrice] = useState(String(ov?.price ?? product.price));
  const [stock, setStock] = useState(String(ov?.stock ?? product.stock));

  useEffect(() => {
    setPrice(String(ov?.price ?? product.price));
    setStock(String(ov?.stock ?? product.stock));
  }, [ov, product]);

  const currentPrice = ov?.price ?? product.price;
  const changed = Number(price) !== currentPrice || Number(stock) !== (ov?.stock ?? product.stock);

  return (
    <div className="bg-white rounded-2xl border border-border p-3 flex gap-3">
      <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0" loading="lazy" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
          <span className="text-[10px] text-muted-foreground">{product.weight}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Default: {rupiah(product.price)} · stok {product.stock}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[10px] text-muted-foreground">
            Harga (Rp)
            <input type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-0.5 w-full text-sm font-semibold border border-border rounded-lg px-2 py-1.5" />
          </label>
          <label className="text-[10px] text-muted-foreground">
            Stok
            <input type="number" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-0.5 w-full text-sm font-semibold border border-border rounded-lg px-2 py-1.5" />
          </label>
        </div>
        <button
          disabled={!changed || saving}
          onClick={() => onSave(product.id, Number(price), Number(stock))}
          className="mt-2 w-full bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {saving ? "Menyimpan..." : changed ? "Simpan" : "Tersimpan"}
        </button>
      </div>
    </div>
  );
}

function OngkirAdmin() {
  const shipping = useCatalog((s) => s.shipping);
  const setShippingState = useCatalog((s) => s.setShipping);
  const [rows, setRows] = useState(shipping);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => { setRows(shipping); }, [shipping]);

  const update = (i: number, patch: Partial<typeof rows[number]>) => {
    setRows((r) => r.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  };

  const save = async (i: number) => {
    const row = rows[i];
    setSavingKey(row.key);
    const { error } = await supabase.from("shipping_options").update({
      label: row.label, description: row.description, price: row.price,
    }).eq("key", row.key);
    setSavingKey(null);
    if (error) { toast.error(error.message); return; }
    setShippingState(rows);
    toast.success("Ongkir tersimpan");
  };

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-xs text-muted-foreground">Atur tarif dan keterangan setiap metode pengiriman.</p>
      {rows.map((r, i) => (
        <div key={r.key} className="bg-white rounded-2xl border border-border p-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{r.key}</p>
          <label className="block text-[10px] text-muted-foreground">
            Nama Metode
            <input value={r.label} onChange={(e) => update(i, { label: e.target.value })} className="mt-0.5 w-full text-sm font-semibold border border-border rounded-lg px-2 py-1.5" />
          </label>
          <label className="block text-[10px] text-muted-foreground">
            Deskripsi
            <input value={r.description} onChange={(e) => update(i, { description: e.target.value })} className="mt-0.5 w-full text-sm border border-border rounded-lg px-2 py-1.5" />
          </label>
          <label className="block text-[10px] text-muted-foreground">
            Tarif (Rp)
            <input type="number" inputMode="numeric" value={r.price} onChange={(e) => update(i, { price: Number(e.target.value) })} className="mt-0.5 w-full text-sm font-semibold border border-border rounded-lg px-2 py-1.5" />
          </label>
          <button
            onClick={() => save(i)}
            disabled={savingKey === r.key}
            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {savingKey === r.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan
          </button>
        </div>
      ))}
    </div>
  );
}
