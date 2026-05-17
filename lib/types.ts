// Schema is Supabase/Postgres-ready. UUIDs, ISO timestamps, snake_case.

export type RelationshipType =
  | "manager"
  | "peer"
  | "report"
  | "mentor"
  | "external"
  | "friend"
  | "partner";

export type Importance = 1 | 2 | 3;

export type Quadrant =
  | "real_partnership"
  | "coffee_buddy"
  | "power_play"
  | "polite_distance";

// The two top-level circles we group people into.
export type Sphere = "work" | "personal";

export type Person = {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  relationship_type: RelationshipType;
  importance: Importance;
  power_score: number; // 0..100
  candor_score: number; // 0..100
  target_power: number | null;
  target_candor: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type InteractionKind =
  | "1:1"
  | "meeting"
  | "message"
  | "social"
  | "conflict"
  | "feedback"
  | "ask"
  | "other";

export type Felt = "energizing" | "neutral" | "draining";

export type Interaction = {
  id: string;
  user_id: string;
  person_id: string;
  occurred_at: string;
  kind: InteractionKind;
  what_happened: string;
  felt_like: Felt | null;
  power_delta: number; // -10..+10
  candor_delta: number; // -10..+10
};

export type InsightKind = "drift" | "gap" | "win" | "ask" | "pattern";

export type Insight = {
  id: string;
  user_id: string;
  person_id: string | null;
  kind: InsightKind;
  title: string;
  body: string;
  suggested_action: string;
  created_at: string;
  dismissed_at: string | null;
  acted_on_at: string | null;
};

export type User = {
  id: string;
  name: string;
  role: string;
  one_line_goal: string;
  power_self_assessment: number; // 0..100
  candor_self_assessment: number;
};
