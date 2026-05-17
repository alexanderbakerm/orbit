import { Briefcase, Heart } from "lucide-react";
import { mockPeople, getSphere } from "@/lib/mock-data";
import {
  balanceScore,
  quadrantFor,
  sortByAttention,
} from "@/lib/scoring";
import { MentalMap } from "@/components/quadrant/mental-map";
import { PersonCard } from "@/components/circle/person-card";
import { TodayFocus } from "@/components/circle/today-focus";
import type { Person, Sphere } from "@/lib/types";

export default function CirclePage() {
  const all = mockPeople;

  // Average balance score, rounded — matches the spec's "balance score 64" header.
  const avgBalance = Math.round(
    all.reduce((sum, p) => sum + balanceScore(p), 0) / all.length
  );

  const byAttention = sortByAttention(all);

  // Today's focus heuristics:
  // - candor: top-importance person whose candor is most below target
  // - power: top-importance person whose power is most below target
  // - maintain: highest-balance person, used as the anchor to keep going
  const candorPick = pickGap(all, "candor");
  const powerPick = pickGap(all, "power");
  const maintainPick = [...all].sort(
    (a, b) => balanceScore(b) - balanceScore(a)
  )[0];

  const workPeople = byAttention.filter((p) => getSphere(p) === "work");
  const personalPeople = byAttention.filter(
    (p) => getSphere(p) === "personal"
  );

  return (
    <div className="px-5 pt-12">
      <header>
        <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-tight text-ink">
          My Circle
        </h1>
        <p className="mt-2 text-[13px] text-ink-muted">
          {all.length} people · balance score {avgBalance}
        </p>
      </header>

      <section className="mt-6">
        <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
          Today’s focus
        </div>
        <div className="mt-3">
          <TodayFocus
            candor={candorPick}
            power={powerPick}
            maintain={maintainPick}
          />
        </div>
      </section>

      <CircleSection
        sphere="work"
        people={workPeople}
        icon={<Briefcase className="h-4 w-4" strokeWidth={1.75} />}
        eyebrow="Sphere"
        title="Work"
        blurb="Your professional orbit — managers, peers, mentors. Where leverage lives."
      />

      <CircleSection
        sphere="personal"
        people={personalPeople}
        icon={<Heart className="h-4 w-4" strokeWidth={1.75} />}
        eyebrow="Sphere"
        title="Personal"
        blurb="The people who tell you the truth when work won’t. Anchors of candor."
      />
    </div>
  );
}

function CircleSection({
  sphere,
  people,
  icon,
  eyebrow,
  title,
  blurb,
}: {
  sphere: Sphere;
  people: Person[];
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  blurb: string;
}) {
  if (people.length === 0) return null;

  // Quadrant breakdown for this sphere
  const counts = people.reduce(
    (acc, p) => {
      const q = quadrantFor(p.power_score, p.candor_score);
      acc[q] = (acc[q] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 text-ink-muted">
        <span className="text-[11px] uppercase tracking-[0.1em] font-medium">
          {eyebrow}
        </span>
      </div>
      <div className="mt-1 flex items-baseline justify-between">
        <h2 className="font-serif text-[22px] font-medium text-ink flex items-center gap-2">
          <span className="text-forest">{icon}</span>
          {title}
        </h2>
        <span className="text-[12px] text-ink-muted">
          {people.length} {people.length === 1 ? "person" : "people"}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-ink-muted">{blurb}</p>

      {/* The mental map */}
      <div className="mt-4 rounded-[20px] bg-cream-surface border-hairline p-4">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
            Mental map
          </div>
          <div className="text-[11px] text-ink-faint">
            Tap a dot to open
          </div>
        </div>
        <div className="mt-2">
          <MentalMap people={people} size="md" />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-muted">
          <Tally label="Real partnership" n={counts.real_partnership ?? 0} />
          <Tally label="Power play" n={counts.power_play ?? 0} />
          <Tally label="Coffee buddy" n={counts.coffee_buddy ?? 0} />
          <Tally label="Polite distance" n={counts.polite_distance ?? 0} />
        </div>
      </div>

      {/* The list */}
      <div className="mt-4 space-y-3">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} />
        ))}
      </div>
    </section>
  );
}

function Tally({ label, n }: { label: string; n: number }) {
  if (n === 0) return null;
  return (
    <span>
      <span className="text-ink">{n}</span>{" "}
      <span className="text-ink-muted">{label.toLowerCase()}</span>
    </span>
  );
}

// Pick the person whose target axis is most under-served, biased by importance.
function pickGap(people: Person[], axis: "candor" | "power"): Person | null {
  let best: Person | null = null;
  let bestScore = -Infinity;
  for (const p of people) {
    const target = axis === "candor" ? p.target_candor : p.target_power;
    const current = axis === "candor" ? p.candor_score : p.power_score;
    if (target == null) continue;
    const gap = target - current;
    if (gap <= 0) continue;
    const score = gap + p.importance * 6;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best ?? people[0] ?? null;
}

