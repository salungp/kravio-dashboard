import { cn } from "@/lib/utils"
import type { Kpi } from "@/data/dashboard"
import { AnimatedNumber } from "./animated-number"
import { CardHeader, CardShell, CardTitle, Icon, InsetImg } from "./card-shell"

type Spark = { name: string; w: number; h: number; box: [number, number]; inset: string }

const SPARKS: Record<string, Spark> = {
  tickets: { name: "spark-1", w: 92, h: 38, box: [91, 36.026], inset: "-3.11% -0.4% -0.47% -0.52%" },
  resolution: { name: "spark-2", w: 92, h: 33, box: [91, 32.158], inset: "-1.97% -0.4% 0 -0.13%" },
  sla: { name: "spark-3", w: 92, h: 37, box: [91, 35.842], inset: "-1.77% -0.38% 0 -0.43%" },
}

type CardDef = { key: "tickets" | "resolution" | "sla"; title: string; icon: string; patternLeft: string; tracking?: string }

const CARDS: CardDef[] = [
  { key: "tickets", title: "Current Tickets", icon: "ticket", patternLeft: "calc(50% - 55.17px)" },
  { key: "resolution", title: "Daily Avg. Resolution", icon: "zap", patternLeft: "calc(50% - 54.83px)", tracking: "tracking-[-0.14px]" },
  { key: "sla", title: "SLA Compliance Rate", icon: "timer", patternLeft: "calc(50% - 55.5px)" },
]

function KpiCard({ def, kpi, compare, index, periodKey }: { def: CardDef; kpi: Kpi; compare: string; index: number; periodKey: string }) {
  const spark = SPARKS[def.key]
  const up = kpi.delta >= 0
  const deltaDecimals = Number.isInteger(kpi.delta) ? 0 : 1

  return (
    <CardShell
      className="group/kpi h-[140px] min-w-0 flex-1 animate-rise"
      style={{ animationDelay: `${80 + index * 70}ms` }}
      patternStyle={{ left: def.patternLeft, top: -0.8, transform: "translateX(-50%)" }}
      aria-label={def.title}
    >
      <CardHeader>
        <CardTitle className={def.tracking}>{def.title}</CardTitle>
        <Icon name={def.icon} className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/kpi:-rotate-12 group-hover/kpi:scale-110" />
      </CardHeader>
      <div className="relative flex min-h-px w-full flex-1 items-end justify-between rounded-[10px] border-[0.8px] border-border bg-card px-3 pb-3 transition-[box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] group-hover/kpi:-translate-y-px group-hover/kpi:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <div className="flex flex-col items-start gap-3 whitespace-nowrap leading-none">
          <p className="text-2xl font-medium text-foreground">
            <AnimatedNumber value={kpi.value} suffix={kpi.suffix} delay={150 + index * 90} />
          </p>
          <p className="flex items-center gap-1.5">
            <span className={cn("text-xs font-medium", up ? "text-success" : "text-destructive")}>
              <AnimatedNumber value={kpi.delta} decimals={deltaDecimals} prefix={up ? "+" : ""} suffix="%" delay={250 + index * 90} duration={1100} />
            </span>
            <span className="text-[13px] text-muted-foreground">{compare}</span>
          </p>
        </div>
        <div className="flex items-end">
          <div
            key={periodKey}
            className="relative shrink-0 animate-draw transition-transform duration-300 group-hover/kpi:scale-[1.04]"
            style={{ width: spark.box[0], height: spark.box[1], animationDelay: `${300 + index * 120}ms`, transformOrigin: "bottom right" }}
          >
            <InsetImg name={spark.name} w={spark.w} h={spark.h} inset={spark.inset} />
          </div>
        </div>
      </div>
    </CardShell>
  )
}

export function KpiCards({ data, compare, periodKey }: { data: Record<"tickets" | "resolution" | "sla", Kpi>; compare: string; periodKey: string }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map((def, i) => (
        <KpiCard key={def.key} def={def} kpi={data[def.key]} compare={compare} index={i} periodKey={periodKey} />
      ))}
    </div>
  )
}
