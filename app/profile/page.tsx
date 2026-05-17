"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, PenLine } from "lucide-react";

const TABS = ["Profile", "Draft Coach"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Profile");

  return (
    <div className="px-5 pt-12">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-cream-sunken rounded-xl mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200",
              tab === t
                ? "bg-cream-surface text-ink shadow-sm"
                : "text-ink-muted"
            )}
          >
            {t === "Profile" ? (
              <User className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <PenLine className="h-4 w-4" strokeWidth={1.75} />
            )}
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" ? <ProfileTab /> : <DraftCoachTab />}
    </div>
  );
}

/* ── Profile tab ── */

function ProfileTab() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-sage-200 text-forest font-medium text-xl flex items-center justify-center">
          A
        </div>
        <div>
          <h1 className="font-serif text-[24px] leading-tight font-medium text-ink">
            Alex
          </h1>
          <p className="text-[13px] text-ink-muted mt-0.5">Your leadership profile</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-[18px] font-medium text-ink">Communication style</h2>
        <p className="mt-2 text-[14px] text-ink-muted">
          Full profile and communication patterns land in checkpoint 6.
        </p>
        <div className="mt-4 space-y-3">
          {[
            { label: "Messages coached", value: "—" },
            { label: "Avg. score improvement", value: "—" },
            { label: "Most coached contact", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-4 rounded-[20px] bg-cream-surface border-hairline"
            >
              <span className="text-[13px] text-ink-muted">{stat.label}</span>
              <span className="text-[14px] font-medium text-ink">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── Draft Coach tab ── */

const contacts = [
  { id: "1", name: "Alex Chen", role: "VP Engineering", initials: "AC", power: "high" as const, candor: "high" as const },
  { id: "2", name: "Jordan Lee", role: "Product Lead", initials: "JL", power: "high" as const, candor: "low" as const },
  { id: "3", name: "Sam Rivera", role: "Design Director", initials: "SR", power: "low" as const, candor: "high" as const },
  { id: "4", name: "Morgan Patel", role: "CEO", initials: "MP", power: "high" as const, candor: "low" as const },
  { id: "5", name: "Taylor Kim", role: "Peer Engineer", initials: "TK", power: "low" as const, candor: "low" as const },
];

type Quadrant = `${typeof contacts[number]["power"]}-${typeof contacts[number]["candor"]}`;
type Framework = "touchy-feely" | "path-to-power" | "acting-with-power";

interface Suggestion { text: string; framework: Framework }
interface CoachingResult { score: number; tone: string; suggestions: Suggestion[]; rewrite: string; powerPlay: string }

const frameworkLabels: Record<Framework, string> = {
  "touchy-feely": "Interpersonal Dynamics",
  "path-to-power": "Path to Power",
  "acting-with-power": "Acting with Power",
};

const frameworkColors: Record<Framework, string> = {
  "touchy-feely": "text-signal-warn",
  "path-to-power": "text-forest",
  "acting-with-power": "text-signal-good",
};

function detectPatterns(message: string) {
  const lower = message.toLowerCase();
  return {
    wordCount: message.trim().split(/\s+/).length,
    hasQuestion: message.includes("?"),
    isAllCaps: message === message.toUpperCase() && message.length > 10,
    exclamationCount: (message.match(/!/g) || []).length,
    hasApology: /\b(sorry|apologize|my bad|forgive)\b/i.test(message),
    hasHedge: /\b(just|maybe|might|kind of|sort of|i think|i guess|probably|perhaps|not sure)\b/i.test(message),
    hasSelfDisclosure: /\b(i feel|i'm feeling|i noticed|i've been|honestly|to be honest|what i need|for me)\b/i.test(message),
    hasImpact: /\b(when you|the impact|it felt|that landed|what i heard)\b/i.test(message),
    hasDirective: /\b(you need to|you should|you must|do this|make sure you|i need you to)\b/i.test(message),
    hasGratitude: /\b(thank|appreciate|grateful|valued)\b/i.test(message),
    hasPermissionSeeking: /\b(is it ok|would it be alright|can i|may i|do you mind|if that's ok)\b/i.test(message),
    hasNetworking: /\b(connect|introduction|intro|coffee|pick your brain|learn from)\b/i.test(lower),
    hasReciprocity: /\b(in return|happy to|i can offer|let me know how i can|mutual)\b/i.test(lower),
  };
}

function analyzeMessage(message: string, power: string, candor: string): CoachingResult {
  const quadrant: Quadrant = `${power}-${candor}` as Quadrant;
  const p = detectPatterns(message);
  const suggestions: Suggestion[] = [];
  let score = 70;
  let tone = "";
  let rewrite = message;
  let powerPlay = "";

  if (quadrant === "high-high") {
    tone = "Play high — match their directness";
    powerPlay = "They respect people who take up space. Play high: own your position, be concise, don't over-explain.";
    if (p.hasHedge) { suggestions.push({ text: "Drop the hedging language. With high-power, high-candor people, hedges like \"just\" or \"maybe\" shrink your presence. They read confidence, not caution.", framework: "acting-with-power" }); score -= 12; rewrite = removeHedges(message); }
    if (p.hasApology && !p.hasImpact) { suggestions.push({ text: "Unnecessary apologies play low when this person expects you to play high. Remove \"sorry\" unless you caused real harm.", framework: "acting-with-power" }); score -= 8; rewrite = removeApologies(rewrite); }
    if (p.hasSelfDisclosure) { suggestions.push({ text: "Good — you're sharing how you actually feel. High-candor people trust self-disclosure because they operate the same way. This expands your Johari Window with them.", framework: "touchy-feely" }); score += 8; }
    else { suggestions.push({ text: "This person values authenticity. Try naming what you actually feel or need — move something from your hidden area into the open.", framework: "touchy-feely" }); score -= 5; }
    if (p.hasQuestion) { suggestions.push({ text: "Asking questions signals you value their expertise — a smart way to build your resource network with someone who has both power and openness.", framework: "path-to-power" }); score += 5; }
    if (p.wordCount < 10) { suggestions.push({ text: "Too brief. This person can handle substance and expects it. Undersharing with a high-candor person closes the Johari Window.", framework: "touchy-feely" }); score -= 8; }
    score = Math.min(score + 10, 95);
  } else if (quadrant === "high-low") {
    tone = "Play strategically — lead with value";
    powerPlay = "They have power but don't share freely. Play high enough to be taken seriously, but don't force openness — earn it through demonstrated value.";
    suggestions.push({ text: "This person guards information. In Johari Window terms, their hidden area is large by design. Don't try to pry it open — reduce your own blind spots by observing what they do, not what they say.", framework: "touchy-feely" });
    if (p.hasPermissionSeeking) { suggestions.push({ text: "Permission-seeking language plays too low here. You're handing them a reason to say no. State your intent with quiet confidence — Gruenfeld's \"relaxed high\" is the move.", framework: "acting-with-power" }); score -= 12; rewrite = removePermissionSeeking(rewrite); }
    if (!p.hasReciprocity && p.hasNetworking) { suggestions.push({ text: "You're asking without offering. Pfeffer's rule: powerful people track reciprocity closely. Lead with what you bring to the table, then make the ask.", framework: "path-to-power" }); score -= 10; }
    if (p.hasHedge) { suggestions.push({ text: "Hedges signal uncertainty to someone who respects decisiveness. Remove \"just,\" \"maybe,\" \"sort of\" — every hedge costs you credibility with a power player.", framework: "acting-with-power" }); score -= 10; rewrite = removeHedges(rewrite); }
    if (p.wordCount > 50) { suggestions.push({ text: "Too long. High-power, low-candor people scan for relevance. Pfeffer's principle: respect their time and you signal that you understand status dynamics.", framework: "path-to-power" }); score -= 10; rewrite = shortenForPower(rewrite); }
    if (!p.hasQuestion) { suggestions.push({ text: "End with one focused question. It gives them control over how much to share — safe for low-candor people, and it keeps the door open.", framework: "touchy-feely" }); score -= 5; rewrite = rewrite.trimEnd() + "\n\nI'd value your perspective — what stands out to you here?"; }
    if (p.wordCount <= 50 && !p.hasHedge) score += 8;
  } else if (quadrant === "low-high") {
    tone = "Play low — create partnership";
    powerPlay = "They're open but have less organizational power. Play low to create safety and connection — use warmth, not authority.";
    if (p.hasDirective) { suggestions.push({ text: "Directive language plays too high here. You'll shut down someone who would otherwise share freely. Gruenfeld: \"play low\" — use inviting language, ask rather than tell.", framework: "acting-with-power" }); score -= 15; rewrite = softDirectives(rewrite); }
    if (p.hasSelfDisclosure || p.hasImpact) { suggestions.push({ text: "Great use of self-disclosure. With a high-candor person, sharing your own feelings invites them to go deeper — this is the Touchy Feely feedback loop at its best.", framework: "touchy-feely" }); score += 10; }
    else { suggestions.push({ text: "This person is ready for real talk but needs you to go first. Share how you're feeling or what you're noticing — model the vulnerability you want back.", framework: "touchy-feely" }); }
    if (p.isAllCaps || p.exclamationCount > 2) { suggestions.push({ text: "High intensity plays dominant when you need to play equal. Tone it down — your energy could feel like status-pulling even if you don't intend it.", framework: "acting-with-power" }); score -= 12; }
    suggestions.push({ text: "This person may not advance your position directly, but Pfeffer's network principle applies: weak ties carry novel information. Invest in this relationship for insight, not leverage.", framework: "path-to-power" });
    score = Math.min(score + 5, 92);
  } else {
    tone = "Play low and create safety";
    powerPlay = "They have neither power nor openness — likely guarded for a reason. Play deliberately low to create psychological safety before asking for anything.";
    suggestions.push({ text: "Their Johari Window is mostly hidden and blind. They won't push back even if they disagree. Your job is to make dissent safe — name that it's okay to disagree.", framework: "touchy-feely" });
    if (p.hasDirective) { suggestions.push({ text: "Directives will get compliance, not honesty. Play low — replace commands with genuine curiosity. Ask \"What do you see?\" not \"Do this.\"", framework: "acting-with-power" }); score -= 15; rewrite = softDirectives(rewrite); }
    if (!p.hasQuestion) { suggestions.push({ text: "Without a question, you're monologuing at someone who won't interrupt. Add a genuine question — make space for them to share what they really think.", framework: "touchy-feely" }); score -= 10; rewrite = rewrite.trimEnd() + "\n\nI genuinely want your honest take on this — even if it's different from mine."; }
    if (p.hasSelfDisclosure) { suggestions.push({ text: "Sharing your own uncertainty is powerful here. It signals that vulnerability is safe — they're more likely to open up when you go first.", framework: "touchy-feely" }); score += 8; }
    suggestions.push({ text: "Don't overlook this person. Pfeffer's insight: people underestimate those without obvious power. Building trust now means having an ally when the org chart shifts.", framework: "path-to-power" });
    if (p.hasApology) { suggestions.push({ text: "Apologizing to someone with less power can feel patronizing or create awkward status dynamics. Be warm and direct instead.", framework: "acting-with-power" }); score -= 5; }
  }

  if (p.isAllCaps) { suggestions.unshift({ text: "All caps reads as shouting regardless of intent — it's a dominance signal that damages trust across every quadrant.", framework: "acting-with-power" }); score -= 20; }
  if (p.hasGratitude && !p.hasApology) score += 5;

  return { score: Math.max(score, 15), tone, suggestions, rewrite, powerPlay };
}

function removeHedges(msg: string) { return msg.replace(/\b(just|maybe|kind of|sort of|i guess|probably|perhaps)\b\s*/gi, "").replace(/\bi think\b/gi, "I believe").replace(/\bnot sure\b/gi, "exploring").replace(/\s{2,}/g, " ").trim(); }
function removeApologies(msg: string) { return msg.replace(/\b(i'm so sorry|i'm sorry|sorry)\b[,.]?\s*/gi, "").replace(/\s{2,}/g, " ").trim(); }
function removePermissionSeeking(msg: string) { return msg.replace(/\bis it ok if\b/gi, "I'd like to").replace(/\bwould it be alright\b/gi, "I plan to").replace(/\bdo you mind if\b/gi, "I'll").replace(/\bif that's ok\b/gi, "").replace(/\s{2,}/g, " ").trim(); }
function softDirectives(msg: string) { return msg.replace(/\byou need to\b/gi, "it might help to").replace(/\byou should\b/gi, "one option is to").replace(/\byou must\b/gi, "it would be worth").replace(/\bi need you to\b/gi, "could you").replace(/\bmake sure you\b/gi, "when you get a chance,").trim(); }
function shortenForPower(msg: string) { const s = msg.split(/(?<=[.!?])\s+/); return s.length <= 2 ? msg : s.slice(0, 2).join(" ") + "\n\nWhat stands out to you here?"; }

function scoreColor(score: number) { if (score >= 80) return "text-signal-good"; if (score >= 60) return "text-signal-warn"; return "text-signal-risk"; }
function scoreBg(score: number) { if (score >= 80) return "bg-signal-good"; if (score >= 60) return "bg-signal-warn"; return "bg-signal-risk"; }

function DraftCoachTab() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CoachingResult | null>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [copied, setCopied] = useState(false);

  const contact = contacts.find((c) => c.id === selectedContact);

  function handleAnalyze() {
    if (!contact || !message.trim()) return;
    setResult(analyzeMessage(message, contact.power, contact.candor));
  }

  function handleReset() { setResult(null); setMessage(""); setSelectedContact(null); }

  function handleCopyRewrite() {
    if (!result) return;
    navigator.clipboard.writeText(result.rewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-ink-muted text-sm">Before you hit send</p>
        <h2 className="font-serif text-[22px] font-medium text-ink mt-1">Draft Coach</h2>
      </div>

      {/* Contact selector */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Who are you messaging?</label>
        <button onClick={() => setShowContacts(!showContacts)} className="mt-2 w-full flex items-center gap-3 p-3 bg-cream-surface rounded-xl text-left">
          {contact ? (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage-100 text-sage-600 text-sm font-medium">{contact.initials}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{contact.name}</p>
                <p className="text-xs text-ink-muted">{contact.role} · {contact.power} power · {contact.candor} candor</p>
              </div>
              <ChevronIcon />
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cream-sunken text-ink-faint"><PersonIcon /></div>
              <span className="text-sm text-ink-faint">Select a contact</span>
              <ChevronIcon />
            </>
          )}
        </button>
        {showContacts && (
          <div className="mt-1 bg-cream-surface rounded-xl border border-cream-sunken overflow-hidden">
            {contacts.map((c) => (
              <button key={c.id} onClick={() => { setSelectedContact(c.id); setShowContacts(false); setResult(null); }} className="w-full flex items-center gap-3 p-3 hover:bg-cream-sunken/50 text-left">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-600 text-xs font-medium">{c.initials}</div>
                <div>
                  <p className="text-sm text-ink">{c.name}</p>
                  <p className="text-xs text-ink-muted">{c.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message input */}
      <div>
        <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Your draft message</label>
        <textarea value={message} onChange={(e) => { setMessage(e.target.value); setResult(null); }} placeholder="Paste or type your message here..." rows={5} className="mt-2 w-full p-4 bg-cream-sunken rounded-xl text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-2 focus:ring-forest/20 resize-none" />
        <p className="mt-1 text-xs text-ink-faint text-right">{message.trim().split(/\s+/).filter(Boolean).length} words</p>
      </div>

      {/* Analyze */}
      {!result && (
        <button onClick={handleAnalyze} disabled={!contact || !message.trim()} className="w-full py-3 rounded-xl bg-forest text-cream font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed">
          Analyze Draft
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-cream-surface rounded-xl">
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E8E2CE" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" className={scoreBg(result.score).replace("bg-", "stroke-")} strokeWidth="3" strokeDasharray={`${result.score}, 100`} strokeLinecap="round" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${scoreColor(result.score)}`}>{result.score}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Communication Score</p>
              <p className="text-xs text-ink-muted mt-0.5">{result.tone}</p>
            </div>
          </div>

          <div className="p-4 bg-forest/5 border border-forest/15 rounded-xl">
            <p className="text-xs font-medium text-forest uppercase tracking-wide mb-1">Power Read</p>
            <p className="text-sm text-ink">{result.powerPlay}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide">Coaching</h3>
            {result.suggestions.map((s, i) => (
              <div key={i} className="flex gap-2 p-3 bg-cream-surface rounded-xl">
                <span className="mt-0.5 text-forest"><LightbulbIcon /></span>
                <div className="flex-1">
                  <p className="text-sm text-ink">{s.text}</p>
                  <span className={`inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider ${frameworkColors[s.framework]}`}>{frameworkLabels[s.framework]}</span>
                </div>
              </div>
            ))}
          </div>

          {result.rewrite !== message && (
            <div>
              <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">Suggested rewrite</h3>
              <div className="p-4 bg-signal-good/5 border border-signal-good/20 rounded-xl">
                <p className="text-sm text-ink whitespace-pre-wrap">{result.rewrite}</p>
                <button onClick={handleCopyRewrite} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-signal-good">
                  <CopyIcon />{copied ? "Copied!" : "Copy to clipboard"}
                </button>
              </div>
            </div>
          )}

          <button onClick={handleReset} className="w-full py-3 rounded-xl border border-forest/20 text-forest font-medium text-sm">Coach another draft</button>
        </div>
      )}
    </div>
  );
}

function ChevronIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-faint ml-auto"><polyline points="6 9 12 15 18 9" /></svg>; }
function PersonIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>; }
function LightbulbIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5C8.35 12.26 8.82 13.02 9 14" /></svg>; }
function CopyIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>; }
