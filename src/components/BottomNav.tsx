import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useStore } from "@/lib/store";

const tabs = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/kategori", label: "Kategori", icon: LayoutGrid },
  { to: "/keranjang", label: "Keranjang", icon: ShoppingCart, badge: true },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/akun", label: "Akun", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useStore((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-border">
      <ul className="grid grid-cols-5 max-w-[430px] mx-auto">
        {tabs.map((t) => {
          const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
          const Icon = t.icon;
          const showBadge = (t.label === "Keranjang" && count > 0) || (t.label === "Wishlist" && wishCount > 0);
          const badgeNum = t.label === "Keranjang" ? count : wishCount;
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                      {badgeNum}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
