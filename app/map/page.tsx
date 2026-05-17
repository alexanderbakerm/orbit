"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const contacts = [
  { id: "1", name: "Alex Chen", role: "VP Engineering", initials: "AC", power: "high", candor: "high", lastSeen: "2d ago" },
  { id: "2", name: "Jordan Lee", role: "Product Lead", initials: "JL", power: "high", candor: "low", lastSeen: "4d ago" },
  { id: "3", name: "Sam Rivera", role: "Design Director", initials: "SR", power: "low", candor: "high", lastSeen: "1w ago" },
  { id: "4", name: "Morgan Patel", role: "CEO", initials: "MP", power: "high", candor: "low", lastSeen: "3d ago" },
  { id: "5", name: "Taylor Kim", role: "Peer Engineer", initials: "TK", power: "low", candor: "low", lastSeen: "2w ago" },
  { id: "6", name: "Casey Brooks", role: "Staff Engineer", initials: "CB", power: "low", candor: "high", lastSeen: "5d ago" },
  { id: "7", name: "Reese Tanaka", role: "CTO", initials: "RT", power: "high", candor: "high", lastSeen: "1d ago" },
];

type Quadrant = "high-high" | "high-low" | "low-high" | "low-low";

const quadrantMeta: Record<Quadrant, { label: string; subtitle: string; bg: string }> = {
  "high-high": { label: "Allies", subtitle: "High power · High candor", bg: "bg-signal-good/8" },
  "high-low": { label: "Navigate", subtitle: "High power · Low candor", bg: "bg-signal-warn/8" },
  "low-high": { label: "Nurture", subtitle: "Low power · High candor", bg: "bg-sage-100/60" },
  "low-low": { label: "Observe", subtitle: "Low power · Low candor", bg: "bg-cream-sunken/60" },
};

function getQuadrant(power: string, candor: string): Quadrant {
  return `${power}-${candor}` as Quadrant;
}

function getPosition(contact: typeof contacts[number], index: number, total: number) {
  const spread = total > 1 ? 30 : 0;
  const angle = (index / Math.max(total, 1)) * Math.PI * 2;
  const offsetX = Math.cos(angle) * spread;
  const offsetY = Math.sin(angle) * spread;
  return { x: 50 + offsetX, y: 50 + offsetY };
}

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedContact = contacts.find((c) => c.id === selected);

  const grouped = contacts.reduce((acc, c) => {
    const q = getQuadrant(c.power, c.candor);
    if (!acc[q]) acc[q] = [];
    acc[q].push(c);
    return acc;
  }, {} as Record<Quadrant, typeof contacts>);

  return (
    <div className="px-5 pt-12 pb-8">
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-tight text-ink">
        Map
      </h1>
      <p className="mt-1 text-[14px] text-ink-muted">
        Your relationships on the power × candor grid
      </p>

      {/* Axis labels */}
      <div className="mt-6 relative">
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-ink-faint mb-1 px-1">
          <span>Low candor</span>
          <span>High candor</span>
        </div>

        {/* Grid */}
        <div className="relative">
          {/* Y-axis label */}
          <div className="absolute -left-1 top-0 bottom-0 flex flex-col justify-between text-[10px] uppercase tracking-wider text-ink-faint py-2 -translate-x-full pr-2">
            <span className="writing-mode-vertical">High power</span>
            <span className="writing-mode-vertical">Low power</span>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-[2px] rounded-2xl overflow-hidden border border-cream-sunken">
            {/* Top-left: High power, Low candor */}
            <QuadrantCell
              quadrant="high-low"
              contacts={grouped["high-low"] || []}
              selected={selected}
              onSelect={setSelected}
            />
            {/* Top-right: High power, High candor */}
            <QuadrantCell
              quadrant="high-high"
              contacts={grouped["high-high"] || []}
              selected={selected}
              onSelect={setSelected}
            />
            {/* Bottom-left: Low power, Low candor */}
            <QuadrantCell
              quadrant="low-low"
              contacts={grouped["low-low"] || []}
              selected={selected}
              onSelect={setSelected}
            />
            {/* Bottom-right: Low power, High candor */}
            <QuadrantCell
              quadrant="low-high"
              contacts={grouped["low-high"] || []}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {(Object.entries(quadrantMeta) as [Quadrant, typeof quadrantMeta[Quadrant]][]).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2 text-[11px] text-ink-muted">
            <div className={cn("w-2.5 h-2.5 rounded-full", {
              "bg-signal-good": key === "high-high",
              "bg-signal-warn": key === "high-low",
              "bg-sage-400": key === "low-high",
              "bg-ink-faint": key === "low-low",
            })} />
            <span>{meta.label}</span>
          </div>
        ))}
      </div>

      {/* Selected contact detail */}
      {selectedContact && (
        <div className="mt-4 p-4 bg-cream-surface rounded-2xl border-hairline animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sage-100 text-sage-600 text-sm font-medium">
              {selectedContact.initials}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-ink">{selectedContact.name}</p>
              <p className="text-[13px] text-ink-muted">{selectedContact.role}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-ink-faint p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cream-sunken text-ink-muted">
              {selectedContact.power} power
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cream-sunken text-ink-muted">
              {selectedContact.candor} candor
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-cream-sunken text-ink-muted">
              {selectedContact.lastSeen}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6">
        <h2 className="font-serif text-[18px] font-medium text-ink">Distribution</h2>
        <div className="mt-3 space-y-2">
          {(Object.entries(quadrantMeta) as [Quadrant, typeof quadrantMeta[Quadrant]][]).map(([key, meta]) => {
            const count = (grouped[key] || []).length;
            const pct = Math.round((count / contacts.length) * 100);
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[13px] text-ink-muted w-20">{meta.label}</span>
                <div className="flex-1 h-6 bg-cream-sunken rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", {
                      "bg-signal-good/40": key === "high-high",
                      "bg-signal-warn/40": key === "high-low",
                      "bg-sage-200": key === "low-high",
                      "bg-ink-faint/30": key === "low-low",
                    })}
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-ink w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function QuadrantCell({
  quadrant,
  contacts: quadrantContacts,
  selected,
  onSelect,
}: {
  quadrant: Quadrant;
  contacts: typeof contacts;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const meta = quadrantMeta[quadrant];

  return (
    <div className={cn("relative aspect-square p-3", meta.bg)}>
      <span className="text-[11px] font-medium text-ink-muted">{meta.label}</span>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-2">
          {quadrantContacts.map((c, i) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(isSelected ? null : c.id)}
                className={cn(
                  "flex items-center justify-center rounded-full text-[11px] font-medium transition-all duration-200",
                  isSelected
                    ? "w-11 h-11 bg-forest text-cream ring-2 ring-forest ring-offset-2 ring-offset-cream scale-110 z-10"
                    : "w-9 h-9 bg-sage-100 text-sage-600 hover:scale-105"
                )}
              >
                {c.initials}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
