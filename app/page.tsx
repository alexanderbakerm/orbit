import { Search } from "lucide-react";

const FIRST_NAME = "Alex";

export default function HomePage() {
  return (
    <div className="px-5 pt-12">
      <header className="flex items-start justify-between">
        <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-tight text-ink">
          Hi, {FIRST_NAME}.
        </h1>
        <div
          aria-label="Your profile"
          className="h-10 w-10 rounded-full bg-sage-200 text-forest font-medium text-[14px] flex items-center justify-center"
        >
          {FIRST_NAME[0]}
        </div>
      </header>

      <div className="mt-6">
        <div className="flex items-center gap-3 h-12 rounded-full bg-cream-sunken px-4 border-hairline">
          <Search className="h-4 w-4 text-ink-faint" strokeWidth={1.75} />
          <span className="text-[14px] text-ink-faint">
            Ask the coach or search a person…
          </span>
        </div>
      </div>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[22px] font-medium text-ink">
            What we noticed
          </h2>
          <span className="text-[11px] uppercase tracking-[0.1em] font-medium text-ink-muted">
            From this week
          </span>
        </div>

        {/* Placeholder card — the real insight card lands in Checkpoint 3 */}
        <div className="mt-4 rounded-[20px] bg-cream-surface border-hairline p-5 min-h-[180px]">
          <div className="h-3 w-32 rounded-full bg-cream-sunken" />
          <div className="mt-4 h-5 w-3/4 rounded-full bg-cream-sunken" />
          <div className="mt-2 h-5 w-2/3 rounded-full bg-cream-sunken" />
          <div className="mt-6 h-10 w-40 rounded-full bg-cream-sunken" />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[22px] font-medium text-ink">
            Recent interactions
          </h2>
          <span className="text-[12px] text-ink-muted">See all</span>
        </div>
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[20px] bg-cream-surface border-hairline p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-cream-sunken" />
              <div className="flex-1 min-w-0">
                <div className="h-3 w-1/3 rounded-full bg-cream-sunken" />
                <div className="mt-2 h-3 w-2/3 rounded-full bg-cream-sunken" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
