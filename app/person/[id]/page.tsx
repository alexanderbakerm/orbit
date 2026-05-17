import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { mockPeople, mockInteractions } from "@/lib/mock-data";
import {
  RELATIONSHIP_COLOR,
  RELATIONSHIP_LABEL,
  balanceScore,
  initialsOf,
  quadrantFor,
  QUADRANT_LABEL,
} from "@/lib/scoring";
import { MentalMap } from "@/components/quadrant/mental-map";

export default function PersonPage({ params }: { params: { id: string } }) {
  const person = mockPeople.find((p) => p.id === params.id);
  if (!person) notFound();

  const interactions = mockInteractions
    .filter((i) => i.person_id === person.id)
    .sort(
      (a, b) =>
        new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );

  const score = balanceScore(person);
  const q = quadrantFor(person.power_score, person.candor_score);

  const targetMap =
    person.target_power != null && person.target_candor != null
      ? {
          [person.id]: {
            power: person.target_power,
            candor: person.target_candor,
          },
        }
      : undefined;

  const dotColor = RELATIONSHIP_COLOR[person.relationship_type];

  return (
    <div className="px-5 pt-6">
      <Link
        href="/circle"
        className="inline-flex items-center gap-1 text-[13px] text-ink-muted active:text-ink"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        My Circle
      </Link>

      <header className="mt-4 flex items-center gap-3">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center text-[18px] font-medium"
          style={{ backgroundColor: dotColor, color: "#F4EFE2" }}
          aria-hidden
        >
          {initialsOf(person.name)}
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-[28px] leading-[1.05] font-medium tracking-tight text-ink">
            {person.name}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-muted">
            <span className="inline-flex items-center bg-sage-100 text-forest rounded-full px-2 py-0.5 leading-none">
              {RELATIONSHIP_LABEL[person.relationship_type]}
            </span>
            {person.role && <span className="truncate">{person.role}</span>}
          </div>
        </div>
      </header>

      <section className="mt-6 rounded-[20px] bg-cream-surface border-hairline p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
            Where you sit
          </div>
          <div className="text-[11px] text-ink-faint">
            {QUADRANT_LABEL[q]} · balance {score}
          </div>
        </div>
        <div className="mt-2">
          <MentalMap
            people={[person]}
            targetMap={targetMap}
            focusedId={person.id}
            size="md"
          />
        </div>
      </section>

      {person.notes && (
        <section className="mt-6">
          <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
            What’s true
          </div>
          <div className="mt-2 rounded-[20px] bg-cream-surface border-hairline p-4 text-[14px] leading-[1.5] text-ink">
            {person.notes}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
          History
        </div>
        {interactions.length === 0 ? (
          <div className="mt-2 text-[13px] text-ink-muted">
            No interactions logged yet.
          </div>
        ) : (
          <div className="mt-2 space-y-3">
            {interactions.map((i) => (
              <div
                key={i.id}
                className="rounded-[20px] bg-cream-surface border-hairline p-4"
              >
                <div className="flex items-center justify-between text-[11px] text-ink-faint">
                  <span className="uppercase tracking-[0.08em]">{i.kind}</span>
                  <time dateTime={i.occurred_at}>
                    {new Date(i.occurred_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="mt-1 text-[14px] text-ink leading-[1.5]">
                  {i.what_happened}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
