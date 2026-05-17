import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { Person } from "@/lib/types";
import {
  RELATIONSHIP_COLOR,
  RELATIONSHIP_LABEL,
  balanceScore,
  initialsOf,
} from "@/lib/scoring";
import { cn } from "@/lib/utils";

export function PersonCard({ person }: { person: Person }) {
  const score = balanceScore(person);
  const dotColor = RELATIONSHIP_COLOR[person.relationship_type];
  const scoreLow = score < 60;

  return (
    <Link
      href={`/person/${person.id}`}
      className={cn(
        "block rounded-[20px] bg-cream-surface border-hairline p-4",
        "active:scale-[0.98] transition-all duration-200 ease-out"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 text-[14px] font-medium"
          style={{ backgroundColor: dotColor, color: "#F4EFE2" }}
          aria-hidden
        >
          {initialsOf(person.name)}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center bg-sage-100 text-forest text-[11px] rounded-full px-2 py-0.5 leading-none">
            {RELATIONSHIP_LABEL[person.relationship_type]}
          </span>
          <div className="mt-1 font-serif text-[17px] font-medium text-ink leading-tight truncate">
            {person.name}
          </div>
          {person.role && (
            <div className="text-[12px] text-ink-muted truncate">
              {person.role}
            </div>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-ink-muted">
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" strokeWidth={1.75} />
              power {person.power_score}
            </span>
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" strokeWidth={1.75} />
              candor {person.candor_score}
            </span>
          </div>
        </div>

        {/* Score circle */}
        <ScoreCircle score={score} low={scoreLow} />
      </div>
    </Link>
  );
}

function ScoreCircle({ score, low }: { score: number; low: boolean }) {
  return (
    <div
      aria-label={`Balance score ${score}`}
      className={cn(
        "h-11 w-11 rounded-full flex items-center justify-center shrink-0 text-[14px] font-medium",
        low ? "bg-sage-200 text-forest" : "bg-forest text-cream"
      )}
    >
      {score}
    </div>
  );
}
