"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const contacts = [
  { id: "1", name: "Alex Chen", role: "VP Engineering", initials: "AC", power: "high" as const, candor: "high" as const, lastSeen: "2d ago", quadrant: "Allies" },
  { id: "2", name: "Jordan Lee", role: "Product Lead", initials: "JL", power: "high" as const, candor: "low" as const, lastSeen: "4d ago", quadrant: "Navigate" },
  { id: "3", name: "Sam Rivera", role: "Design Director", initials: "SR", power: "low" as const, candor: "high" as const, lastSeen: "1w ago", quadrant: "Nurture" },
  { id: "4", name: "Morgan Patel", role: "CEO", initials: "MP", power: "high" as const, candor: "low" as const, lastSeen: "3d ago", quadrant: "Navigate" },
  { id: "5", name: "Taylor Kim", role: "Peer Engineer", initials: "TK", power: "low" as const, candor: "low" as const, lastSeen: "2w ago", quadrant: "Observe" },
  { id: "6", name: "Casey Brooks", role: "Staff Engineer", initials: "CB", power: "low" as const, candor: "high" as const, lastSeen: "5d ago", quadrant: "Nurture" },
  { id: "7", name: "Reese Tanaka", role: "CTO", initials: "RT", power: "high" as const, candor: "high" as const, lastSeen: "1d ago", quadrant: "Allies" },
];

type Filter = "all" | "Allies" | "Navigate" | "Nurture" | "Observe";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Allies", value: "Allies" },
  { label: "Navigate", value: "Navigate" },
  { label: "Nurture", value: "Nurture" },
  { label: "Observe", value: "Observe" },
];

const quadrantColor: Record<string, string> = {
  Allies: "bg-signal-good",
  Navigate: "bg-signal-warn",
  Nurture: "bg-sage-400",
  Observe: "bg-ink-faint",
};

const avatarStyle: Record<string, string> = {
  Allies: "bg-signal-good/15 text-signal-good",
  Navigate: "bg-signal-warn/15 text-signal-warn",
  Nurture: "bg-sage-100 text-sage-600",
  Observe: "bg-cream-sunken text-ink-faint",
};

export default function CirclePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) => {
    const matchesFilter = filter === "all" || c.quadrant === filter;
    const matchesSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="px-5 pt-12 pb-8">
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-tight text-ink">
        Circle
      </h1>
      <p className="mt-1 text-[14px] text-ink-muted">
        {contacts.length} people in your orbit
      </p>

      {/* Search */}
      <div className="mt-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search by name or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-cream-surface border-hairline text-[14px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-forest/20"
        />
      </div>

      {/* Filter chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors",
              filter === f.value
                ? "bg-forest text-cream"
                : "bg-cream-surface text-ink-muted border-hairline"
            )}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1 opacity-60">
                {contacts.filter((c) => c.quadrant === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contact list */}
      <div className="mt-4 space-y-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-cream-surface border-hairline"
          >
            <div
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-full text-[13px] font-medium",
                avatarStyle[c.quadrant]
              )}
            >
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-medium text-ink truncate">
                  {c.name}
                </p>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    quadrantColor[c.quadrant]
                  )}
                />
              </div>
              <p className="text-[13px] text-ink-muted truncate">{c.role}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[11px] text-ink-faint">{c.lastSeen}</span>
              <ChevronRight className="h-4 w-4 text-ink-faint" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[14px] text-ink-muted">No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
