import { BottomNav } from "./bottom-nav";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-cream">
      {/* Centered mobile column. Anything outside it is the warm cream chrome. */}
      <div className="mx-auto w-full max-w-[420px] min-h-dvh bg-cream relative flex flex-col">
        <main className="flex-1 pb-32">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
