"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Users, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const LEFT: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map", icon: Map },
];

const RIGHT: NavItem[] = [
  { href: "/circle", label: "Circle", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-40 pointer-events-none"
    >
      {/* FAB sits above the bar, overlapping by ~20px */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-auto">
        <Link
          href="/log"
          aria-label="Log an interaction"
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            "bg-forest text-cream",
            "active:scale-[0.96] transition-all duration-200 ease-out",
            "shadow-[0_2px_0_0_rgba(15,40,32,0.12)]"
          )}
        >
          <Plus className="h-6 w-6" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="pointer-events-auto h-20 bg-cream-surface border-t border-hairline grid grid-cols-5 items-center px-2">
        <NavLink item={LEFT[0]} active={pathname === LEFT[0].href} />
        <NavLink item={LEFT[1]} active={pathname.startsWith(LEFT[1].href)} />
        <span aria-hidden className="block" />
        <NavLink
          item={RIGHT[0]}
          active={pathname.startsWith(RIGHT[0].href)}
        />
        <NavLink
          item={RIGHT[1]}
          active={pathname.startsWith(RIGHT[1].href)}
        />
      </div>
    </nav>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-1 h-full",
        "transition-colors duration-200 ease-out",
        active ? "text-forest" : "text-ink-faint"
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      <span className="text-[10px] uppercase tracking-[0.1em] font-medium">
        {item.label}
      </span>
    </Link>
  );
}
