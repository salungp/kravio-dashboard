import * as React from "react"

import { BAR_LEFTS, DAYS, PERIODS, PLOT_W, TREND, Y_TICKS, toValue, type Period } from "@/data/dashboard"
import { asset } from "@/lib/assets"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "./animated-number"
import { CardHeader, CardShell, CardTitle, Icon, InsetImg } from "./card-shell"
import { PeriodSelect } from "./period-select"

const PLOT_H = 216
const BAR_W = 40
const pct = (px: number) => `${(px / PLOT_W) * 100}%`

export function TicketTrend({ period, onPeriodChange }: { period: Period; onPeriodChange: (p: Period) => void }) {
  const data = TREND[period]
  const compare = PERIODS.find((p) => p.value === period)!.compare
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [pinned, setPinned] = React.useState<number | null>(null)
  const active = hovered ?? pinned ?? data.active

  React.useEffect(() => setPinned(null), [period])

  const bar = data.bars[active]
  const left = BAR_LEFTS[active]
  const top = PLOT_H - bar.height
  const value = toValue(bar.height)
  // Tag sits left of the bar (design); flips to the right when it would clip the plot edge.
  const flip = left < 81

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      const next = Math.min(data.bars.length - 1, Math.max(0, active + (e.key === "ArrowRight" ? 1 : -1)))
      setPinned(next)
      setHovered(null)
    }
  }

  return (
    <CardShell
      className="h-[404px] w-full animate-rise [animation-delay:260ms]"
      patternStyle={{ left: "calc(50% - 0.5px)", top: "50%", transform: "translate(-50%, -50%)" }}
      aria-labelledby="trend-title"
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon name="ticket" />
          <CardTitle id="trend-title">Ticket Volume Trend</CardTitle>
        </div>
        <PeriodSelect value={period} onChange={onPeriodChange} variant="surface" label="Trend range" />
      </CardHeader>

      <div className="relative flex min-h-px w-full flex-1 flex-col items-start justify-between overflow-clip rounded-xl border-[0.8px] border-input bg-card px-3.5 pb-3.5 pt-4">
        <div className="flex items-end gap-3 whitespace-nowrap leading-none">
          <p className="text-[32px] font-medium text-foreground">
            <AnimatedNumber value={data.total} delay={320} />
          </p>
          <p className="flex items-center gap-1.5">
            <span className={cn("text-xs font-medium", data.delta >= 0 ? "text-success" : "text-destructive")}>
              <AnimatedNumber value={data.delta} prefix={data.delta >= 0 ? "+" : ""} suffix="%" delay={420} duration={1000} />
            </span>
            <span className="text-[13px] tracking-[-0.13px] text-muted-foreground">{compare}</span>
          </p>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {/* Plot */}
            <div
              role="group"
              tabIndex={0}
              aria-label="Ticket volume by half-day. Use left and right arrow keys to inspect bars."
              onKeyDown={onKeyDown}
              onMouseLeave={() => setHovered(null)}
              className="relative h-[216px] w-full overflow-clip rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <span className="pointer-events-none absolute left-0 top-px block h-[214px] w-full min-w-[825px]">
                <InsetImg name="grid" w={825} h={216} inset="-0.19% 0 -0.42% 0" />
              </span>

              {data.bars.map((b, i) => {
                const on = i === active
                return (
                  <div
                    key={i}
                    className="absolute bottom-0 transition-[height] duration-700 ease-[var(--ease-out-expo)]"
                    style={{ left: pct(BAR_LEFTS[i]), width: pct(BAR_W), height: b.height }}
                  >
                    <div
                      className="animate-grow relative size-full"
                      style={{ animationDelay: `${380 + i * 45}ms` }}
                    >
                      {/* glass bar */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-b-[4px] rounded-t-[8px] transition-opacity duration-300",
                          on ? "opacity-0" : "opacity-100"
                        )}
                      >
                        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[#e6e6e6] to-[rgba(230,230,230,0.6)] backdrop-blur-[50px]" />
                        {/* 0.444px inside stroke over a 1px white inner glow (sub-pixel, like Figma) */}
                        <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_0.444px_var(--chart-bar-border),inset_0px_0px_0px_1px_white]" />
                      </div>
                      {/* active bar */}
                      <div
                        className={cn(
                          "absolute inset-0 rounded-b-[4px] rounded-t-[8px] bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.697%)] shadow-[inset_0_0_0_0.44px_#1f2937,0px_2px_10px_0px_rgba(31,41,55,0.08)] transition-[opacity,transform] duration-300",
                          on ? "opacity-100" : "scale-y-[0.98] opacity-0"
                        )}
                        style={{ transformOrigin: "bottom" }}
                      />
                    </div>
                  </div>
                )
              })}

              {/* Callout: dashed guide + dot + value tag */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 animate-fade [animation-delay:1100ms]"
              >
                <div
                  className="absolute h-0 transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ left: `calc(${pct(left)} + 3px)`, top: top - 0.5, width: `max(559px, calc(100% - ${pct(left)} - 3px))` }}
                >
                  <InsetImg name="dashed-line" w={560} h={1} inset="-0.4px 0" />
                </div>
                <img
                  key={flip ? "r" : "l"}
                  src={asset("line-dot")}
                  alt=""
                  width={4}
                  height={4}
                  className="absolute block size-1 transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ left: flip ? `calc(${pct(left + BAR_W)})` : `calc(${pct(left)} - 4px)`, top: top - 2.5 }}
                />
                <div
                  className="absolute h-6 w-[75px] transition-[left,top] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ left: flip ? `calc(${pct(left + BAR_W)} + 6px)` : `calc(${pct(left)} - 81px)`, top: top - 12 }}
                >
                  <InsetImg name="tooltip-tag" w={73} h={24} inset="0 3.2% 0 0" className={flip ? "-scale-x-100" : undefined} />
                  <p key={`${bar.label}-${value}`} className="absolute top-1.5 animate-fade whitespace-nowrap text-xs font-medium leading-none text-white" style={{ left: flip ? 14 : 6 }}>
                    {bar.label} : {value}
                  </p>
                </div>
              </div>

              {/* Hit targets */}
              {data.bars.map((b, i) => (
                <button
                  key={`hit-${i}`}
                  type="button"
                  tabIndex={-1}
                  aria-label={`${b.label}: ${toValue(b.height)} tickets`}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onClick={() => setPinned(i)}
                  className="absolute bottom-0 top-0 cursor-crosshair"
                  style={{ left: `calc(${pct(BAR_LEFTS[i])} - 8px)`, width: `calc(${pct(BAR_W)} + 16px)` }}
                />
              ))}

              <div className="pointer-events-none absolute left-0 top-0 h-[215px] w-[85px] bg-gradient-to-l from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.6)]" />
              <div className="pointer-events-none absolute right-0 top-0 h-[215px] w-[85px] bg-gradient-to-r from-[rgba(255,255,255,0)] to-[rgba(255,255,255,0.6)]" />
              <p className="sr-only" aria-live="polite">
                {bar.label}: {value} tickets
              </p>
            </div>

            {/* X axis */}
            <div className="flex w-full items-center gap-1.5" aria-hidden>
              {DAYS.map((d) => (
                <div key={d} className="flex min-w-0 flex-1 items-center justify-center">
                  <p
                    className={cn(
                      "whitespace-nowrap text-[13px] leading-none tracking-[-0.13px] transition-colors duration-300",
                      (hovered ?? pinned) !== null && d === bar.label ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {d}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Y axis */}
          <div className="flex h-[220px] flex-col items-end justify-between" aria-hidden>
            {Y_TICKS.map((t) => (
              <div key={t} className="flex w-full items-center justify-center">
                <p className="whitespace-nowrap text-[13px] leading-none tracking-[-0.13px] text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}
