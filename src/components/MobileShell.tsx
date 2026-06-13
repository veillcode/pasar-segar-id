import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function MobileShell({ children, hideNav = false }: { children: ReactNode; hideNav?: boolean }) {
  return (
    <div className="phone-shell flex flex-col">
      <div className="flex-1 flex flex-col pb-2">{children}</div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
