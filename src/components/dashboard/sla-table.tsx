import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupInput } from "@/components/ui/input"
import { TICKETS, slaLabel, type Priority, type Status, type Ticket } from "@/data/dashboard"
import { asset } from "@/lib/assets"
import { cn } from "@/lib/utils"
import { CardHeader, CardShell, CardTitle, Icon } from "./card-shell"

const PRIORITY_ICON: Record<Priority, string> = { High: "signal-full", Medium: "signal-medium", Low: "signal-low" }
const STATUS_ICON: Record<Status, string> = { "In Review": "status-review", Delivered: "status-delivered", "In Progress": "status-progress" }
const AVATAR: Record<Ticket["assignee"], string> = { "John Doe": "avatar-john", "Sarah Lee": "avatar-sarah", "Michael Wong": "avatar-michael" }
const PRIORITY_RANK: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 }

type SortKey = "id" | "subject" | "priority" | "assignee" | "status" | "created" | "slaHours"
type Sort = { key: SortKey; dir: "asc" | "desc" } | null

const COLS: { key: SortKey; label: string }[] = [
  { key: "subject", label: "Subject" },
  { key: "priority", label: "Priority" },
  { key: "assignee", label: "Assigned To" },
  { key: "status", label: "Status" },
  { key: "created", label: "Created Date" },
  { key: "slaHours", label: "SLA Due" },
]

/* 140 | subject | 160 ×4 | 140 | 40  (header's SLA Due spans the last two = 180) */
const GRID = "grid grid-cols-[140px_minmax(170px,1fr)_160px_160px_160px_160px_140px_40px]"
const cell = "flex h-full min-w-0 items-center px-3 py-2.5"
const cellText = "truncate text-[13px] font-medium leading-none text-cell-foreground"

function compare(a: Ticket, b: Ticket, key: SortKey) {
  if (key === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  if (key === "slaHours") return a.slaHours - b.slaHours
  return String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true })
}

function SortIcon({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) {
  return (
    <img
      src={asset("sort")}
      alt=""
      width={12}
      height={12}
      className={cn(
        "block size-3 shrink-0 transition-[transform,opacity] duration-200",
        active ? "opacity-100" : "opacity-100 group-hover/th:opacity-70",
        active && dir === "desc" && "rotate-180"
      )}
    />
  )
}

function toCsv(rows: Ticket[]) {
  const head = ["Ticket ID", "Subject", "Priority", "Assigned To", "Status", "Created Date", "SLA Due"]
  const body = rows.map((t) => [t.id, t.subject, t.priority, t.assignee, t.status, t.created, slaLabel(t.slaHours)])
  return [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
}

export function SlaTable() {
  const [rows, setRows] = React.useState<Ticket[]>(TICKETS)
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["#2319"]))
  const [sort, setSort] = React.useState<Sort>(null)
  const [query, setQuery] = React.useState("")
  const [priorities, setPriorities] = React.useState<Set<Priority>>(new Set())
  const [statuses, setStatuses] = React.useState<Set<Status>>(new Set())

  const q = query.trim().toLowerCase()
  const visible = React.useMemo(() => {
    let r = rows.filter(
      (t) =>
        (!q || `${t.id} ${t.subject} ${t.assignee}`.toLowerCase().includes(q)) &&
        (!priorities.size || priorities.has(t.priority)) &&
        (!statuses.size || statuses.has(t.status))
    )
    if (sort) r = [...r].sort((a, b) => compare(a, b, sort.key) * (sort.dir === "asc" ? 1 : -1))
    return r
  }, [rows, q, priorities, statuses, sort])

  const allOn = visible.length > 0 && visible.every((t) => selected.has(t.id))
  const someOn = visible.some((t) => selected.has(t.id))
  const filterCount = priorities.size + statuses.size

  const toggleSort = (key: SortKey) =>
    setSort((s) => (!s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null))

  const toggleRow = (id: string) =>
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s)
      visible.forEach((t) => (allOn ? n.delete(t.id) : n.add(t.id)))
      return n
    })

  const toggleIn = <T,>(set: React.Dispatch<React.SetStateAction<Set<T>>>, v: T) =>
    set((s) => {
      const n = new Set(s)
      if (n.has(v)) n.delete(v)
      else n.add(v)
      return n
    })

  const updateRow = (id: string, patch: Partial<Ticket>) => setRows((r) => r.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const exportCsv = () => {
    const rowsOut = visible.filter((t) => !selected.size || selected.has(t.id))
    const url = URL.createObjectURL(new Blob([toCsv(rowsOut)], { type: "text/csv" }))
    const a = Object.assign(document.createElement("a"), { href: url, download: "sla-monitoring.csv" })
    a.click()
    URL.revokeObjectURL(url)
  }

  const ariaSort = (key: SortKey) => (sort?.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none")

  return (
    <CardShell
      className="w-full animate-rise [animation-delay:340ms]"
      patternStyle={{ left: "calc(50% - 28.5px)", top: "calc(50% + 58.5px)", transform: "translate(-50%, -50%)" }}
      aria-labelledby="sla-title"
    >
      <CardHeader className="flex-wrap gap-2 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <Icon name="target" />
          <CardTitle id="sla-title">SLA Monitoring</CardTitle>
        </div>
        <div className="flex w-full items-start gap-2 sm:w-auto">
          <InputGroup className="h-8 min-w-0 flex-1 border-input shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)] sm:w-[240px] sm:flex-none">
            <Icon name="tb-search" />
            <InputGroupInput type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ticket" aria-label="Search tickets" />
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="surface" className="group/f h-8 gap-1.5 pl-2 pr-2.5">
                <Icon name="filter" className="transition-transform duration-200 group-hover/f:translate-y-px" />
                Filter
                {filterCount > 0 && (
                  <span className="-mr-1 ml-0.5 flex size-4 animate-pop items-center justify-center rounded-full bg-primary text-[10px] leading-none text-primary-foreground tabular">
                    {filterCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuGroup>
                {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                  <DropdownMenuCheckboxItem key={p} checked={priorities.has(p)} onCheckedChange={() => toggleIn(setPriorities, p)} onSelect={(e) => e.preventDefault()}>
                    <Icon name={PRIORITY_ICON[p]} />
                    {p}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuGroup>
                {(["In Review", "In Progress", "Delivered"] as Status[]).map((s) => (
                  <DropdownMenuCheckboxItem key={s} checked={statuses.has(s)} onCheckedChange={() => toggleIn(setStatuses, s)} onSelect={(e) => e.preventDefault()}>
                    <Icon name={STATUS_ICON[s]} />
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
              {filterCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      setPriorities(new Set())
                      setStatuses(new Set())
                    }}
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="surface" size="icon" aria-label="Table actions">
                <Icon name="more" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={exportCsv}>Export {selected.size ? "selected" : "all"} as CSV</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSort(null)} disabled={!sort}>
                  Reset sorting
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelected(new Set())} disabled={!selected.size}>
                  Clear selection
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <div className="relative w-full overflow-x-auto rounded-xl bg-card p-1.5 shadow-[inset_0_0_0_0.8px_var(--input)] [scrollbar-width:thin]">
        <div role="table" aria-label="SLA monitoring" aria-rowcount={visible.length + 1} className="min-w-[1138px]">
          {/* Head */}
          <div role="row" className={cn(GRID, "h-9 rounded-lg border-[0.8px] border-black/[0.04] bg-secondary")}>
            <div role="columnheader" aria-sort={ariaSort("id")} className="flex h-full items-center gap-3 py-2.5 pl-3 pr-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allOn ? true : someOn && selected.size > 1 ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all tickets"
                />
                <button type="button" onClick={() => toggleSort("id")} className="group/th flex items-center gap-3 outline-none">
                  <span className={cn("whitespace-nowrap text-[13px] leading-none transition-colors", sort?.key === "id" ? "text-foreground" : "text-secondary-foreground")}>
                    Ticket ID
                  </span>
                  <SortIcon active={sort?.key === "id"} dir={sort?.dir} />
                </button>
              </div>
            </div>
            {COLS.map((c, i) => (
              <div
                key={c.key}
                role="columnheader"
                aria-sort={ariaSort(c.key)}
                className={cn("flex h-full items-center px-3 py-2.5", i === COLS.length - 1 && "col-span-2")}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(c.key)}
                  className="group/th -mx-1 flex items-center gap-3 rounded px-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                >
                  <span
                    className={cn(
                      "whitespace-nowrap text-[13px] leading-none transition-colors group-hover/th:text-foreground",
                      sort?.key === c.key ? "text-foreground" : "text-secondary-foreground"
                    )}
                  >
                    {c.label}
                  </span>
                  <SortIcon active={sort?.key === c.key} dir={sort?.dir} />
                </button>
              </div>
            ))}
          </div>

          {/* Body */}
          <div role="rowgroup">
            {visible.map((t, i) => {
              const on = selected.has(t.id)
              return (
                <div
                  key={t.id}
                  role="row"
                  aria-selected={on}
                  className={cn(
                    GRID,
                    "group/row h-[45.75px] animate-rise border-b border-black/[0.06] bg-card transition-colors duration-150 hover:bg-[#fafafa]"
                  )}
                  style={{ animationDelay: `${420 + i * 60}ms` }}
                >
                  <div role="cell" className={cn(cell, "gap-2")}>
                    <Checkbox checked={on} onCheckedChange={() => toggleRow(t.id)} aria-label={`Select ticket ${t.id}`} />
                    <span className="whitespace-nowrap text-[13px] font-medium leading-none text-cell-foreground">{t.id}</span>
                  </div>
                  <div role="cell" className={cell}>
                    <span className={cn(cellText, "flex-1 transition-colors group-hover/row:text-foreground")}>{t.subject}</span>
                  </div>
                  <div role="cell" className={cn(cell, "gap-2")}>
                    <Icon name={PRIORITY_ICON[t.priority]} />
                    <span className={cn(cellText, "flex-1")}>{t.priority}</span>
                  </div>
                  <div role="cell" className={cn(cell, "gap-2")}>
                    <Avatar className="transition-transform duration-200 group-hover/row:scale-110">
                      <AvatarImage src={asset(AVATAR[t.assignee])} alt="" width={20} height={20} />
                      <AvatarFallback>{t.assignee.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className={cn(cellText, "flex-1")}>{t.assignee}</span>
                  </div>
                  <div role="cell" className={cn(cell, "gap-2")}>
                    <span key={t.status} className="flex animate-pop">
                      <Icon name={STATUS_ICON[t.status]} />
                    </span>
                    <span className={cellText}>{t.status}</span>
                  </div>
                  <div role="cell" className={cell}>
                    <span className={cn(cellText, "flex-1")}>{t.created}</span>
                  </div>
                  <div role="cell" className={cell}>
                    <span className={cn(cellText, "flex-1")}>{slaLabel(t.slaHours)}</span>
                  </div>
                  <div role="cell" className="flex h-full items-center justify-center py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${t.id}`} className="data-[state=open]:bg-black/[0.05]">
                          <Icon name="more" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t.id}</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onSelect={() => updateRow(t.id, { status: "In Progress" })} disabled={t.status === "In Progress"}>
                            <Icon name="status-progress" />
                            Mark in progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => updateRow(t.id, { status: "In Review" })} disabled={t.status === "In Review"}>
                            <Icon name="status-review" />
                            Send to review
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => updateRow(t.id, { status: "Delivered" })} disabled={t.status === "Delivered"}>
                            <Icon name="status-delivered" />
                            Mark delivered
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Reassign</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {(Object.keys(AVATAR) as Ticket["assignee"][]).map((n) => (
                            <DropdownMenuItem key={n} onSelect={() => updateRow(t.id, { assignee: n })} disabled={t.assignee === n}>
                              <img src={asset(AVATAR[n])} alt="" width={16} height={16} className="size-4 rounded-full" />
                              {n}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
            {visible.length === 0 && (
              <div role="row" className="flex h-[183px] animate-fade flex-col items-center justify-center gap-1.5 text-center">
                <Icon name="tb-search" className="opacity-50" />
                <p className="text-[13px] font-medium text-foreground">No tickets match</p>
                <p className="text-xs text-muted-foreground">Adjust the search or filters.</p>
                <Button
                  variant="surface"
                  size="sm"
                  className="mt-1"
                  onClick={() => {
                    setQuery("")
                    setPriorities(new Set())
                    setStatuses(new Set())
                  }}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardShell>
  )
}
