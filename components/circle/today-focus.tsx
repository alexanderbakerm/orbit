import Link from "next/link";
import type { Person } from "@/lib/types";
import { cn } from "@/lib/utils";

type FocusKind = "candor" | "power" | "maintain";

const COPY: Record<FocusKind, { eyebrow: string; tone: string }> = {
  candor: { eyebrow: "Needs candor", tone: "Be honest about the gap" },
  power: { eyebrow: "Needs power move", tone: "Make the ask this week" },
  maintain: { eyebrow: "Maintain", tone: "Keep the rhythm" },
};

export function TodayFocus({
  candor,
  power,
  maintain,
}: {
  candor: Person | null;
  power: Person | null;
  maintain: Person | null;
}) {
  return (
    <div className="-mx-5 px-5 flex gap-3 overflow-x-auto no-scrollbar pb-1">
      <FocusPill kind="candor" person={candor} />
      <FocusPill kind="power" person={power} />
      <FocusPill kind="maintain" person={maintain} />
    </div>
  );
}

function FocusPill({
  kind,
  person,
}: {
  kind: FocusKind;
  person: Person | null;
}) {
  if (!person) return null;
  const copy = COPY[kind];
  return (
    <Link
      href={`/person/${person.id}`}
      className={cn(
        "min-w-[150px] shrink-0 rounded-[18px] bg-cream-surface border-hairline p-3",
        "active:scale-[0.98] transition-all duration-200 ease-out"
      )}
    >
      <div className="text-[10px] uppercase tracking-[0.1em] font-medium text-ink-muted">
        {copy.eyebrow}
      </div>
      <div className="mt-1 font-serif text-[16px] font-medium text-ink leading-tight">
        {person.name}
      </div>
      <div className="mt-1 text-[11px] text-ink-faint">{copy.tone}</div>
    </Link>
  );
}
