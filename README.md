# Orbit

**Orbit** maps the relationships that move your career — placing each person on a power × candor grid so you can grow influence without losing integrity.

Built as a mobile-first leadership coaching app with an Anthropic-backed coach that gives you personalized guidance based on your relationship patterns.

---

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Fraunces + Inter · Lucide Icons

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app renders as a centered 420 px mobile column on any screen size.

---

## Design system

### Colors

| Token | Hex | Use |
|---|---|---|
| `cream` | `#EFE9D9` | App background / chrome |
| `cream-surface` | `#F4EFE2` | Cards, nav bar |
| `cream-sunken` | `#E8E2CE` | Input fills, skeleton loaders |
| `forest` | `#1B3A2E` | Primary actions, active nav, FAB |
| `sage-*` | `#E4EBD8 → #5A7048` | Avatars, accents |
| `ink` | `#1A1F1B` | Body text |
| `ink-muted` | `#5C625C` | Secondary labels |
| `ink-faint` | `#8B8F87` | Placeholder, disabled |
| `signal-good` | `#2F7A53` | Positive signals |
| `signal-warn` | `#B8853A` | Caution signals |
| `signal-risk` | `#A14A3A` | Risk signals |

### Typography

| Variable | Font | Use |
|---|---|---|
| `font-serif` | Fraunces | Headings, display text |
| `font-sans` | Inter | Body, labels, UI |

---

## Project structure

```
orbit/
├── app/
│   ├── layout.tsx        # Root layout — fonts, MobileShell, metadata
│   ├── page.tsx          # Home — greeting, search, insights, recent contacts
│   ├── map/page.tsx      # 2×2 power × candor map
│   ├── circle/page.tsx   # Your contact circle
│   ├── profile/page.tsx  # Your profile
│   └── log/page.tsx      # Log an interaction
├── components/
│   └── layout/
│       ├── mobile-shell.tsx   # 420px column wrapper
│       └── bottom-nav.tsx     # Home / Map / FAB / Circle / Profile
└── lib/
    └── utils.ts          # cn() and shared helpers
```

---

## Roadmap

| Checkpoint | Status | Scope |
|---|---|---|
| 1 — Shell + design system | ✅ Done | Next.js scaffold, Tailwind tokens, MobileShell, BottomNav, Home stub |
| 2 — 2×2 map | 🔜 Next | Interactive power × candor canvas with contact placement |
| 3 — Insight cards | 🔜 | Weekly pattern summaries, AI-generated observations |
| 4 — Anthropic coach | 🔜 | Conversational coach backed by Claude API |
| 5 — Real data | 🔜 | Contact CRUD, interaction log, persistence |

---

## Contributing

Branch naming: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`

Each checkpoint ships as a PR to `main` with a test plan in the PR description.
