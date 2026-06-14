import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Masuk — Pasar Segar" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/akun" });
  }, [user, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Akun berhasil dibuat!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berhasil masuk!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) {
      toast.error("Login Google gagal");
      setLoading(false);
    }
  };

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link to="/" className="p-1.5 -ml-1.5"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="flex-1 text-center font-semibold text-base">{mode === "signin" ? "Masuk" : "Daftar"}</h1>
          <div className="w-7" />
        </div>
      </header>

      <div className="px-4 pt-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-extrabold">PS</div>
          <h2 className="mt-3 text-xl font-bold">Pasar Segar</h2>
          <p className="text-sm text-muted-foreground">Sayur segar langsung ke rumahmu</p>
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required className="w-full px-4 py-3 rounded-xl border border-border text-sm" />
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={6} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm" />
          </div>
          <button disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Masuk" : "Daftar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <span className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">atau</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <button onClick={handleGoogle} disabled={loading} className="w-full bg-white border border-border font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Lanjutkan dengan Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "signin" ? "Belum punya akun? " : "Sudah punya akun? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold">
            {mode === "signin" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </div>
    </MobileShell>
  );
}
