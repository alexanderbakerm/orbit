import type { Person, Quadrant, RelationshipType } from "./types";

const MIDPOINT = 50;

export function quadrantFor(power: number, candor: number): Quadrant {
  const highP = power >= MIDPOINT;
  const highC = candor >= MIDPOINT;
  if (highP && highC) return "real_partnership";
  if (!highP && highC) return "coffee_buddy";
  if (highP && !highC) return "power_play";
  return "polite_distance";
}

export const QUADRANT_LABEL: Record<Quadrant, string> = {
  real_partnership: "Real partnership",
  coffee_buddy: "Coffee buddy",
  power_play: "Power play",
  polite_distance: "Polite distance",
};

// Geometric mean of power x candor. Penalizes low scores on either axis,
// which is the whole point — a high-power, low-candor relationship is not
// "almost there", it's fragile.
export function balanceScore(person: Person): number {
  return Math.round(Math.sqrt(person.power_score * person.candor_score));
}

// "Attention needed" rank — higher = more urgent.
// Composite of importance, distance from target, and quadrant fragility.
export function attentionScore(person: Person): number {
  const importance = person.importance; // 1..3
  const distP =
    person.target_power == null
      ? 0
      : Math.max(0, person.target_power - person.power_score);
  const distC =
    person.target_candor == null
      ? 0
      : Math.max(0, person.target_candor - person.candor_score);
  const gap = distP + distC;

  // Power plays and polite distances at high importance need shaking.
  const q = quadrantFor(person.power_score, person.candor_score);
  const quadrantWeight =
    q === "power_play" ? 12 : q === "polite_distance" ? 6 : 0;

  return importance * 6 + gap + quadrantWeight;
}

export function sortByAttention(people: Person[]): Person[] {
  return [...people].sort((a, b) => attentionScore(b) - attentionScore(a));
}

// Color tokens per relationship type — kept here so SVG, badges, and chips agree.
export const RELATIONSHIP_COLOR: Record<RelationshipType, string> = {
  manager: "#1B3A2E", // forest
  peer: "#8FA47A", // sage-400
  report: "#B8853A", // signal-warn
  mentor: "#2F7A53", // signal-good
  external: "#5C625C", // ink-muted
  friend: "#2E5444", // forest-soft
  partner: "#A14A3A", // signal-risk → reads as the most intimate / warm
};

export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  manager: "Manager",
  peer: "Peer",
  report: "Report",
  mentor: "Mentor",
  external: "External",
  friend: "Friend",
  partner: "Partner",
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
