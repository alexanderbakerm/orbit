import type { Interaction, Person, Sphere, User } from "./types";

const USER_ID = "u_00000000-0000-0000-0000-000000000001";

const now = "2026-05-17T09:00:00.000Z";
const daysAgo = (n: number) => {
  const d = new Date("2026-05-17T09:00:00.000Z");
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
};

export const mockUser: User = {
  id: USER_ID,
  name: "Alex Baker",
  role: "Senior PM, VP track",
  one_line_goal: "Be considered for the VP role within 12 months.",
  power_self_assessment: 58,
  candor_self_assessment: 71,
};

// 8 people, intentionally distributed so the 2x2 reads as honest:
// - 1 power play (manager Sarah)         — high power, low candor
// - 1 real partnership (peer Marco)      — high both
// - 1 drift: peer Jordan trending down   — was top-right, candor sinking
// - 1 polite distance (VP Priya)         — should know better
// - 1 mentor (David) under-leveraged     — high candor, user under-uses power
// - 1 coffee buddy (Tom)                 — close friend, low strategic power
// - 1 partner (Maya) real partnership    — anchor relationship
// - 1 dormant friend (Ben)               — decide: invest or release
export const mockPeople: Person[] = [
  {
    id: "p_sarah",
    user_id: USER_ID,
    name: "Sarah Chen",
    role: "Director of Product",
    relationship_type: "manager",
    importance: 3,
    power_score: 78,
    candor_score: 38,
    target_power: 80,
    target_candor: 65,
    notes:
      "Reads tone well, but the last 3 meetings have been status-only. Hasn't asked me a single thing about how I'm doing.",
    created_at: daysAgo(180),
    updated_at: daysAgo(2),
  },
  {
    id: "p_marco",
    user_id: USER_ID,
    name: "Marco Rivera",
    role: "Senior PM, Growth",
    relationship_type: "peer",
    importance: 3,
    power_score: 72,
    candor_score: 81,
    target_power: 75,
    target_candor: 82,
    notes:
      "We co-led the H1 launch. He gives me feedback unprompted. Real partnership.",
    created_at: daysAgo(220),
    updated_at: daysAgo(4),
  },
  {
    id: "p_jordan",
    user_id: USER_ID,
    name: "Jordan Park",
    role: "Eng Lead, Platform",
    relationship_type: "peer",
    importance: 2,
    power_score: 68,
    candor_score: 52,
    target_power: 70,
    target_candor: 75,
    notes:
      "Used to be a true partner — last 14 days we've only talked tickets. Drifting toward transactional.",
    created_at: daysAgo(160),
    updated_at: daysAgo(1),
  },
  {
    id: "p_priya",
    user_id: USER_ID,
    name: "Priya Shah",
    role: "VP Product",
    relationship_type: "external",
    importance: 3,
    power_score: 32,
    candor_score: 28,
    target_power: 60,
    target_candor: 50,
    notes:
      "Two levels up. I've been on three calls with her this quarter and said almost nothing. She probably couldn't describe my work.",
    created_at: daysAgo(120),
    updated_at: daysAgo(11),
  },
  {
    id: "p_david",
    user_id: USER_ID,
    name: "David Bloom",
    role: "Former VP, now at Notion",
    relationship_type: "mentor",
    importance: 3,
    power_score: 41,
    candor_score: 88,
    target_power: 70,
    target_candor: 88,
    notes:
      "Will tell me anything I ask. I don't ask enough. Strongest candor in my orbit; weakest use of his political capital.",
    created_at: daysAgo(540),
    updated_at: daysAgo(18),
  },
  {
    id: "p_maya",
    user_id: USER_ID,
    name: "Maya Lin",
    role: "Partner",
    relationship_type: "partner",
    importance: 3,
    power_score: 76,
    candor_score: 92,
    target_power: 78,
    target_candor: 92,
    notes:
      "Knows what I'm chasing and why. Holds me to it. Anchor of my real-partnership column.",
    created_at: daysAgo(1300),
    updated_at: daysAgo(0),
  },
  {
    id: "p_tom",
    user_id: USER_ID,
    name: "Tom Pereira",
    role: "Friend since college",
    relationship_type: "friend",
    importance: 2,
    power_score: 24,
    candor_score: 84,
    target_power: 30,
    target_candor: 86,
    notes:
      "Best at telling me I'm being dramatic. Not strategic; doesn't need to be.",
    created_at: daysAgo(2100),
    updated_at: daysAgo(6),
  },
  {
    id: "p_ben",
    user_id: USER_ID,
    name: "Ben Walsh",
    role: "Old friend",
    relationship_type: "friend",
    importance: 1,
    power_score: 18,
    candor_score: 24,
    target_power: null,
    target_candor: null,
    notes:
      "Used to be close. Now we exchange one text a year. Decide: invest or release.",
    created_at: daysAgo(2800),
    updated_at: daysAgo(140),
  },
];

export function getSphere(person: Person): Sphere {
  return person.relationship_type === "friend" ||
    person.relationship_type === "partner"
    ? "personal"
    : "work";
}

export const mockInteractions: Interaction[] = [
  {
    id: "i_001",
    user_id: USER_ID,
    person_id: "p_sarah",
    occurred_at: daysAgo(2),
    kind: "1:1",
    what_happened:
      "30-min 1:1 — entirely status. She didn't ask how I'm doing. I didn't say.",
    felt_like: "draining",
    power_delta: 0,
    candor_delta: -2,
  },
  {
    id: "i_002",
    user_id: USER_ID,
    person_id: "p_marco",
    occurred_at: daysAgo(4),
    kind: "feedback",
    what_happened:
      "Marco told me my exec note read defensive. Hard to hear, but he's right.",
    felt_like: "energizing",
    power_delta: 1,
    candor_delta: 3,
  },
  {
    id: "i_003",
    user_id: USER_ID,
    person_id: "p_jordan",
    occurred_at: daysAgo(1),
    kind: "meeting",
    what_happened: "Sprint review. We didn't speak outside the agenda.",
    felt_like: "neutral",
    power_delta: 0,
    candor_delta: -1,
  },
  {
    id: "i_004",
    user_id: USER_ID,
    person_id: "p_david",
    occurred_at: daysAgo(18),
    kind: "message",
    what_happened: "I shared the offer letter. He sent back two paragraphs.",
    felt_like: "energizing",
    power_delta: 2,
    candor_delta: 2,
  },
  {
    id: "i_005",
    user_id: USER_ID,
    person_id: "p_maya",
    occurred_at: daysAgo(0),
    kind: "social",
    what_happened:
      "Walked through what would have to be true to take the VP shot.",
    felt_like: "energizing",
    power_delta: 1,
    candor_delta: 1,
  },
];
