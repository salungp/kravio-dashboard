import * as React from "react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { asset } from "@/lib/assets"
import { cn } from "@/lib/utils"
import { InsetImg } from "./card-shell"

type NavLeaf = { id: string; label: string; icon: string; children?: { id: string; label: string }[] }

const MAIN_NAV: NavLeaf[] = [
  { id: "overview", label: "Overview", icon: "sb-dashboard" },
  {
    id: "tickets",
    label: "Tickets",
    icon: "sb-ticket",
    children: [
      { id: "queue", label: "All / My Queue" },
      { id: "sla-risk", label: "SLA Breach Risk" },
      { id: "escalations", label: "Escalations" },
    ],
  },
  { id: "clients", label: "Clients", icon: "user-account" },
  {
    id: "agents",
    label: "Agents & Teams",
    icon: "user-group",
    children: [
      { id: "all-agents", label: "All Agents" },
      { id: "teams", label: "Teams" },
      { id: "schedules", label: "Shift Schedules" },
    ],
  },
  {
    id: "kb",
    label: "Knowledge Base",
    icon: "news",
    children: [
      { id: "articles", label: "Articles" },
      { id: "categories", label: "Categories" },
    ],
  },
  { id: "integrations", label: "Integrations", icon: "flow" },
]

const INSIGHTS_NAV: NavLeaf[] = [
  { id: "sla", label: "SLA Compliance", icon: "clock-01" },
  { id: "csat", label: "CSAT & NPS", icon: "sb-star" },
  { id: "workload", label: "Workload Analytics", icon: "analytics" },
  { id: "reports", label: "Reports", icon: "sb-file" },
]

const SUPPORT_NAV: NavLeaf[] = [
  { id: "feedback", label: "Feedback", icon: "comment" },
  { id: "help", label: "Help & Support", icon: "headset" },
  { id: "settings", label: "Settings", icon: "sb-settings" },
]

const Icon = ({ name, size = 16 }: { name: string; size?: number }) => (
  <img src={asset(name)} width={size} height={size} alt="" className="block shrink-0" style={{ width: size, height: size }} />
)

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="whitespace-nowrap text-xs uppercase leading-[1.6] text-muted-foreground">{children}</p>
}

/* Active pill = Figma "Navigation / Sidebar / Menu" selected state */
const activePill =
  "bg-card border-[0.8px] border-border shadow-[0px_4px_7px_0px_rgba(0,0,0,0.04)] text-foreground"
const idleItem = "border-[0.8px] border-transparent hover:bg-white/70 hover:text-foreground"

function NavItem({
  item,
  active,
  onSelect,
  open,
  onToggle,
  activeChild,
  onSelectChild,
  muted,
}: {
  item: NavLeaf
  active: boolean
  onSelect: (id: string) => void
  open?: boolean
  onToggle?: () => void
  activeChild?: string
  onSelectChild?: (id: string) => void
  muted?: boolean
}) {
  const hasChildren = !!item.children?.length
  const isTickets = item.id === "tickets"

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        onClick={() => (hasChildren ? onToggle?.() : onSelect(item.id))}
        aria-expanded={hasChildren ? open : undefined}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group/nav flex w-full items-center justify-between rounded-lg text-left text-[13px] leading-none outline-none transition-[background-color,box-shadow,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40",
          isTickets ? "h-9 px-2.5" : "h-8 px-2.5",
          active ? activePill : idleItem,
          !active && (muted ? "text-muted-foreground" : "text-secondary-foreground")
        )}
      >
        <span className={cn("flex items-center", isTickets ? "gap-2" : "gap-2.5")}>
          <span className="flex transition-transform duration-200 ease-out group-hover/nav:scale-110">
            <Icon name={item.icon} />
          </span>
          <span className="whitespace-nowrap">{item.label}</span>
        </span>
        {hasChildren && (
          <span className={cn("flex transition-transform duration-300 ease-[var(--ease-out-expo)]", !open && "rotate-180")}>
            <Icon name="arrow-up" size={12} />
          </span>
        )}
      </button>

      {hasChildren && (
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[var(--ease-out-expo)]",
            open ? "mt-0.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-0.5">
              {item.children!.map((c) => {
                const on = activeChild === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onClick={() => onSelectChild?.(c.id)}
                    aria-current={on ? "page" : undefined}
                    className="group/sub relative flex h-7 w-full items-center justify-end pl-2.5 outline-none"
                  >
                    <span
                      className={cn(
                        "flex h-full w-[188px] items-center rounded-md px-0 text-xs leading-none transition-[color,background-color,padding] duration-200 group-hover/sub:bg-white/70 group-hover/sub:pl-1.5 group-hover/sub:text-foreground group-focus-visible/sub:ring-[3px] group-focus-visible/sub:ring-ring/40",
                        on ? "pl-1.5 font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {c.label}
                    </span>
                    <span className="pointer-events-none absolute left-[18px] top-[-5px] h-5 w-2">
                      <InsetImg name="tree-line" w={9} h={21} inset="-2% -5%" />
                    </span>
                    <span className="pointer-events-none absolute left-[23px] top-[13px] size-1">
                      <img
                        src={asset("tree-dot")}
                        alt=""
                        width={4}
                        height={4}
                        className={cn("absolute inset-0 block size-full transition-transform duration-200", on && "scale-150")}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ onCollapse, className }: { onCollapse?: () => void; className?: string }) {
  const [active, setActive] = React.useState("overview")
  const [activeChild, setActiveChild] = React.useState<string | undefined>()
  const [open, setOpen] = React.useState<Record<string, boolean>>({ tickets: true })
  const searchRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const select = (id: string) => {
    setActive(id)
    setActiveChild(undefined)
  }
  const selectChild = (parent: string) => (id: string) => {
    setActive(parent)
    setActiveChild(id)
  }

  const renderGroup = (items: NavLeaf[], muted?: boolean) =>
    items.map((item) => (
      <NavItem
        key={item.id}
        item={item}
        muted={muted}
        active={active === item.id && !activeChild && !item.children}
        onSelect={select}
        open={!!open[item.id]}
        onToggle={() => setOpen((o) => ({ ...o, [item.id]: !o[item.id] }))}
        activeChild={active === item.id ? activeChild : undefined}
        onSelectChild={selectChild(item.id)}
      />
    ))

  return (
    <aside className={cn("flex h-full w-[250px] shrink-0 flex-col", className)} aria-label="Primary">
      {/* Brand */}
      <div className="flex w-[250px] items-center justify-between overflow-clip px-3 py-3.5">
        <a href="#" className="flex w-[200px] items-center gap-3 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
          <span className="relative size-6 shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:rotate-[-8deg] hover:scale-105">
            <InsetImg name="logo" w={34} h={37} inset="-20.83% -20.83% -33.33% -20.83%" />
          </span>
          <span className="flex-1 text-lg font-semibold leading-none text-foreground">Kravio</span>
        </a>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onCollapse}
              aria-label="Collapse sidebar"
              className="-m-1 rounded-md p-1 outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-[3px] focus-visible:ring-ring/40"
            >
              <Icon name="sidebar-right" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Collapse sidebar</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex min-h-0 w-[250px] flex-1 flex-col gap-4 px-3 pb-4">
        <div className="relative h-0 w-full shrink-0">
          <InsetImg name="sb-divider" w={227} h={1} inset="-0.5px -0.22%" />
        </div>

        {/* Search */}
        <InputGroup className="w-full shrink-0 border-border shadow-[0px_4px_14px_0px_rgba(0,0,0,0.04)]">
          <Icon name="search" />
          <InputGroupInput ref={searchRef} type="search" placeholder="Search anything" aria-label="Search anything" />
          <InputGroupAddon aria-hidden className="transition-opacity group-focus-within/input:opacity-0">
            <span className="flex size-4 items-center justify-center rounded p-0.5">
              <Icon name="command" size={12} />
            </span>
            <span className="flex size-4 items-center justify-center rounded p-0.5 text-xs font-medium leading-none text-[#565d76] [font-variation-settings:'opsz'_14]">
              K
            </span>
          </InputGroupAddon>
        </InputGroup>

        {/* Navigation */}
        <nav className="flex min-h-0 w-[226px] flex-1 flex-col items-center justify-between gap-5 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">
          <div className="flex w-full flex-col gap-5">
            <div className="flex w-full flex-col gap-3">
              <SectionLabel>Main Navigation</SectionLabel>
              <div className="flex w-full flex-col gap-0.5">{renderGroup(MAIN_NAV)}</div>
            </div>
            <div className="flex w-full flex-col gap-3">
              <SectionLabel>Analytics &amp; Insights</SectionLabel>
              <div className="flex w-full flex-col gap-0.5">{renderGroup(INSIGHTS_NAV)}</div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3">
            <SectionLabel>Support</SectionLabel>
            <div className="flex w-full flex-col">{renderGroup(SUPPORT_NAV, true)}</div>
          </div>
        </nav>

        {/* Account */}
        <button
          type="button"
          className="group/acct flex w-[226px] shrink-0 items-center gap-2 rounded-xl border-[0.8px] border-border bg-card py-2 pl-2 pr-2.5 text-left outline-none drop-shadow-[0px_0px_4px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-200 hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] active:scale-[0.99] focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border-[0.8px] border-[#d9d9d9] bg-[#f7f7f7] p-2">
            <span className="whitespace-nowrap text-xs font-semibold leading-none tracking-[-0.12px] text-secondary-foreground">AH</span>
            <span className="absolute bottom-[-1.7px] right-[-1.7px] size-[9px]">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/40 [animation-duration:2.4s]" />
              <img src={asset("online-dot")} alt="" width={9} height={9} className="absolute inset-0 block size-full" />
            </span>
          </span>
          <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 whitespace-nowrap leading-none">
            <span className="text-sm font-medium text-foreground">Achmad Hakim</span>
            <span className="truncate text-xs text-subtle-foreground">achmadhakim@gmail.com</span>
          </span>
          <span className="flex transition-transform duration-200 group-hover/acct:scale-110">
            <Icon name="chevron-selector" size={18} />
          </span>
        </button>
      </div>
    </aside>
  )
}
