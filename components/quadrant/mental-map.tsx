import Link from "next/link";
import type { Person } from "@/lib/types";
import { RELATIONSHIP_COLOR, initialsOf } from "@/lib/scoring";
import { cn } from "@/lib/utils";

type Props = {
  people: Person[];
  /** Optional second dot per person — drawn dashed-arrow to it. */
  targetMap?: Record<string, { power: number; candor: number }>;
  /** Tighter aspect for inline / detail use. */
  size?: "sm" | "md";
  className?: string;
  showAxisLabels?: boolean;
  /** Pass a person id to highlight (everyone else fades). */
  focusedId?: string;
};

// Plot coordinates in 0..1 space; we'll project into the SVG viewBox.
function project(value: number) {
  // value 0..100 → 0..1
  const v = Math.max(0, Math.min(100, value)) / 100;
  return v;
}

export function MentalMap({
  people,
  targetMap,
  size = "md",
  className,
  showAxisLabels = true,
  focusedId,
}: Props) {
  // Square-ish viewBox. The 2x2 plot area is inset to leave room for axis labels.
  const VB = 360;
  const INSET = showAxisLabels ? 36 : 16;
  const PLOT_LEFT = INSET;
  const PLOT_RIGHT = VB - INSET;
  const PLOT_TOP = INSET;
  const PLOT_BOTTOM = VB - INSET;
  const PLOT_W = PLOT_RIGHT - PLOT_LEFT;
  const PLOT_H = PLOT_BOTTOM - PLOT_TOP;
  const CX = (PLOT_LEFT + PLOT_RIGHT) / 2;
  const CY = (PLOT_TOP + PLOT_BOTTOM) / 2;

  const dotR = size === "sm" ? 11 : 13;
  const labelOffset = 22;

  const toX = (power: number) => PLOT_LEFT + project(power) * PLOT_W;
  // y is inverted — high candor on top
  const toY = (candor: number) => PLOT_BOTTOM - project(candor) * PLOT_H;

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="w-full h-auto"
        role="img"
        aria-label="Mental map of relationships on power and candor"
      >
        {/* Plot background — bare cream-surface tone to read on cream */}
        <rect
          x={PLOT_LEFT}
          y={PLOT_TOP}
          width={PLOT_W}
          height={PLOT_H}
          fill="none"
        />

        {/* Cross divider lines — sage hairline */}
        <line
          x1={CX}
          y1={PLOT_TOP}
          x2={CX}
          y2={PLOT_BOTTOM}
          stroke="#8FA47A"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <line
          x1={PLOT_LEFT}
          y1={CY}
          x2={PLOT_RIGHT}
          y2={CY}
          stroke="#8FA47A"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* Quadrant micro-labels (corners of the plot area) */}
        <QuadrantLabel
          x={PLOT_LEFT + 6}
          y={PLOT_TOP + 12}
          anchor="start"
          text="Coffee buddy"
        />
        <QuadrantLabel
          x={PLOT_RIGHT - 6}
          y={PLOT_TOP + 12}
          anchor="end"
          text="Real partnership"
        />
        <QuadrantLabel
          x={PLOT_LEFT + 6}
          y={PLOT_BOTTOM - 6}
          anchor="start"
          text="Polite distance"
        />
        <QuadrantLabel
          x={PLOT_RIGHT - 6}
          y={PLOT_BOTTOM - 6}
          anchor="end"
          text="Power play"
        />

        {/* Axis captions */}
        {showAxisLabels && (
          <>
            <text
              x={CX}
              y={VB - 8}
              textAnchor="middle"
              className="fill-ink-muted"
              fontSize="9"
              letterSpacing="1.5"
              style={{
                fontFamily: "var(--font-inter), Inter, system-ui",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Power & agency →
            </text>
            <text
              x={12}
              y={CY}
              textAnchor="middle"
              transform={`rotate(-90, 12, ${CY})`}
              className="fill-ink-muted"
              fontSize="9"
              letterSpacing="1.5"
              style={{
                fontFamily: "var(--font-inter), Inter, system-ui",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Candor & trust →
            </text>
          </>
        )}

        {/* Dashed target arrows (if any) */}
        {targetMap &&
          people.map((p) => {
            const t = targetMap[p.id];
            if (!t) return null;
            return (
              <line
                key={`arrow-${p.id}`}
                x1={toX(p.power_score)}
                y1={toY(p.candor_score)}
                x2={toX(t.power)}
                y2={toY(t.candor)}
                stroke="#5C625C"
                strokeOpacity="0.5"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5C625C" opacity="0.7" />
          </marker>
        </defs>

        {/* Target dots */}
        {targetMap &&
          people.map((p) => {
            const t = targetMap[p.id];
            if (!t) return null;
            return (
              <circle
                key={`target-${p.id}`}
                cx={toX(t.power)}
                cy={toY(t.candor)}
                r={dotR - 4}
                fill="none"
                stroke={RELATIONSHIP_COLOR[p.relationship_type]}
                strokeWidth="1.25"
                strokeDasharray="2 2"
                opacity={focusedId && focusedId !== p.id ? 0.15 : 0.7}
              />
            );
          })}

        {/* People dots */}
        {people.map((p) => {
          const cx = toX(p.power_score);
          const cy = toY(p.candor_score);
          const fill = RELATIONSHIP_COLOR[p.relationship_type];
          const dim = focusedId && focusedId !== p.id;
          return (
            <Link key={p.id} href={`/person/${p.id}`} aria-label={p.name}>
              <g
                style={{ cursor: "pointer" }}
                opacity={dim ? 0.25 : 1}
                className="transition-opacity duration-200"
              >
                {/* Touch target — invisible larger circle */}
                <circle cx={cx} cy={cy} r={dotR + 8} fill="transparent" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={dotR}
                  fill={fill}
                  stroke="#F4EFE2"
                  strokeWidth={p.importance >= 3 ? 2 : 1.25}
                />
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  fontSize={dotR - 2}
                  fill="#F4EFE2"
                  style={{
                    fontFamily: "var(--font-inter), Inter, system-ui",
                    fontWeight: 500,
                  }}
                >
                  {initialsOf(p.name)}
                </text>
                {size === "md" && (
                  <text
                    x={cx}
                    y={cy + labelOffset}
                    textAnchor="middle"
                    fontSize="9"
                    className="fill-ink-muted"
                    style={{
                      fontFamily: "var(--font-inter), Inter, system-ui",
                      fontWeight: 500,
                    }}
                  >
                    {p.name.split(" ")[0]}
                  </text>
                )}
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}

function QuadrantLabel({
  x,
  y,
  anchor,
  text,
}: {
  x: number;
  y: number;
  anchor: "start" | "end";
  text: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize="8.5"
      letterSpacing="1.2"
      className="fill-ink-faint"
      style={{
        fontFamily: "var(--font-inter), Inter, system-ui",
        textTransform: "uppercase",
        fontWeight: 500,
      }}
    >
      {text}
    </text>
  );
}
