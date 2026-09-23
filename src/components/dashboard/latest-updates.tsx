import * as React from "react"

import { InputGroup, InputGroupInput } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ACTIVITY, type Activity, type Part } from "@/data/dashboard"
import { cn } from "@/lib/utils"
import { AnimatedNumber } from "./animated-number"
import { CardHeader, CardShell, CardTitle, Icon, InsetImg } from "./card-shell"

type Tab = keyof typeof ACTIVITY
const TABS: { value: Tab; label: string; caption: string }[] = [
  { value: "today", label: "Today", caption: "new activities today" },
  { value: "yesterday", label: "Yesterday", caption: "activities yesterday" },
  { value: "week", label: "This week", caption: "highlights this week" },
]

const KIND_ICON: Record<Activity["kind"], string> = {
  ticket: "feed-ticket",
  user: "feed-user",
  repeat: "feed-repeat",
  alert: "feed-alert",
  book: "feed-book",
  star: "feed-star",
}

const text = (parts: Part[]) => parts.map((p) => (typeof p === "string" ? p : p.strong)).join("")

function Highlight({ value, query }: { value: string; query: string }) {
  if (!query) return <>{value}</>
  const i = value.toLowerCase().indexOf(query.toLowerCase())
  if (i < 0) return <>{value}</>
  return (
    <>
      {value.slice(0, i)}
      <mark className="rounded-[2px] bg-[#fef3c7] text-inherit">{value.slice(i, i + query.length)}</mark>
      {value.slice(i + query.length)}
    </>
  )
}

function ActivityItem({ a, last, index, query }: { a: Activity; last: boolean; index: number; query: string }) {
  return (
    <li className="group/item relative flex w-full animate-rise items-start gap-3" style={{ animationDelay: `${index * 45}ms` }}>
      <span className="relative z-10 flex items-center rounded-lg border-[0.8px] border-input bg-card p-2 transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-expo)] group-hover/item:-translate-y-px group-hover/item:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
        <Icon name={KIND_ICON[a.kind]} className="transition-transform duration-300 group-hover/item:scale-110" />
      </span>
      {!last && <span aria-hidden className="dash-y absolute bottom-[-20px] left-[15.5px] top-8 w-px" />}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 pt-0.5 text-xs tracking-[-0.12px]">
        <div className="flex w-full items-center justify-between gap-2 leading-none">
          <p className="truncate font-medium text-foreground transition-colors">
            <Highlight value={a.title} query={query} />
          </p>
          <time className="shrink-0 whitespace-nowrap text-subtle-foreground">{a.time}</time>
        </div>
        <p className={cn("text-subtle-foreground", a.wrap ? "leading-[1.4]" : "truncate leading-none")}>
          {a.body.map((p, i) =>
            typeof p === "string" ? (
              <React.Fragment key={i}>
                <Highlight value={p} query={query} />
              </React.Fragment>
            ) : (
              <span key={i} className="text-foreground">
                <Highlight value={p.strong} query={query} />
              </span>
            )
          )}
        </p>
      </div>
    </li>
  )
}

export function LatestUpdates({ className }: { className?: string }) {
  const [tab, setTab] = React.useState<Tab>("today")
  const [query, setQuery] = React.useState("")
  const idx = TABS.findIndex((t) => t.value === tab)
  const q = query.trim()
  const items = ACTIVITY[tab].filter((a) => !q || `${a.title} ${text(a.body)}`.toLowerCase().includes(q.toLowerCase()))
  const caption = TABS[idx].caption

  return (
    <CardShell
      className={cn("h-[560px] animate-rise [animation-delay:200ms]", className)}
      patternStyle={{ left: "calc(50% - 55.5px)", top: -0.8, transform: "translateX(-50%)" }}
      aria-labelledby="updates-title"
    >
      <CardHeader>
        <CardTitle id="updates-title">Latest Updates</CardTitle>
        <Icon name="news" />
      </CardHeader>

      <div className="relative flex min-h-px w-full flex-1 flex-col items-start gap-4 overflow-clip rounded-xl border-[0.8px] border-input bg-card px-3.5 pb-3.5 pt-4">
        <div className="flex w-full flex-col gap-3">
          <ToggleGroup type="single" value={tab} onValueChange={(v) => v && setTab(v as Tab)} aria-label="Activity range" className="w-full">
            {/* sliding selected pill */}
            <span
              aria-hidden
              className="absolute top-0 h-7 rounded-lg border border-primary bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.697%)] transition-[left] duration-300 ease-[var(--ease-out-expo)]"
              style={{ width: "calc((100% - 16px) / 3)", left: `calc(((100% - 16px) / 3 + 8px) * ${idx})` }}
            />
            {TABS.map((t) => (
              <ToggleGroupItem key={t.value} value={t.value}>
                {t.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <InputGroup className="w-full border-border">
            <Icon name="search-2" />
            <InputGroupInput
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search activities"
              aria-label="Search activities"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="animate-fade text-xs leading-none text-subtle-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </InputGroup>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="whitespace-nowrap text-[13px] leading-none tracking-[-0.16px] text-muted-foreground">
            <span className="text-base font-medium text-foreground">
              <AnimatedNumber key={tab} value={items.length} duration={700} delay={tab === "today" ? 300 : 0} />
            </span>
            <span className="text-base"> </span>
            {q ? `${items.length === 1 ? "match" : "matches"} for “${q}”` : caption}
          </p>
          <div className="relative h-0 w-full">
            <InsetImg name="feed-divider" w={296} h={1} inset="-0.5px 0" />
          </div>
        </div>

        <ol key={tab} className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((a, i) => (
            <ActivityItem key={a.id} a={a} last={i === items.length - 1} index={i} query={q} />
          ))}
          {items.length === 0 && (
            <li className="flex w-full animate-fade flex-col items-center gap-1.5 py-10 text-center">
              <Icon name="search-2" className="opacity-50" />
              <p className="text-[13px] font-medium text-foreground">No activity found</p>
              <p className="text-xs text-muted-foreground">Try a ticket number, agent or client name.</p>
            </li>
          )}
        </ol>
      </div>
    </CardShell>
  )
}
