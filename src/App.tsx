import * as React from "react"

import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Header } from "@/components/dashboard/header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { LatestUpdates } from "@/components/dashboard/latest-updates"
import { PeriodSelect } from "@/components/dashboard/period-select"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SlaTable } from "@/components/dashboard/sla-table"
import { TicketTrend } from "@/components/dashboard/ticket-trend"
import { Icon } from "@/components/dashboard/card-shell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KPIS, PERIODS, type Period } from "@/data/dashboard"
import { cn } from "@/lib/utils"

function useIsDesktop() {
  const q = "(min-width: 1024px)"
  const [v, setV] = React.useState(() => window.matchMedia(q).matches)
  React.useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setV(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return v
}

export default function App() {
  const [period, setPeriod] = React.useState<Period>("last-week")
  const [trendPeriod, setTrendPeriod] = React.useState<Period>("last-week")
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed] = React.useState(false) // desktop
  const [drawer, setDrawer] = React.useState(false) // < lg

  const setGlobal = (p: Period) => {
    setPeriod(p)
    setTrendPeriod(p)
  }

  React.useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [drawer])

  React.useEffect(() => {
    if (isDesktop) setDrawer(false)
  }, [isDesktop])

  const compare = PERIODS.find((p) => p.value === period)!.compare
  const sidebarHidden = isDesktop ? collapsed : true

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh w-full bg-background">
        {/* Desktop sidebar */}
        <div
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 overflow-hidden transition-[width] duration-300 ease-[var(--ease-out-expo)] lg:block",
            collapsed ? "w-0" : "w-[250px]"
          )}
          inert={collapsed || undefined}
        >
          <Sidebar onCollapse={() => setCollapsed(true)} className={cn("transition-opacity duration-200", collapsed && "opacity-0")} />
        </div>

        {/* Mobile / tablet drawer */}
        <div className={cn("fixed inset-0 z-40 lg:hidden", drawer ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!drawer}>
          <div
            className={cn("absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")}
            onClick={() => setDrawer(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            inert={!drawer || undefined}
            className={cn(
              "absolute inset-y-0 left-0 h-dvh bg-background shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] transition-transform duration-300 ease-[var(--ease-out-expo)] pb-[env(safe-area-inset-bottom)]",
              drawer ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar onCollapse={() => setDrawer(false)} />
          </div>
        </div>

        {/* Content */}
        <main className="flex min-w-0 flex-1 flex-col bg-card shadow-[inset_0_0_0_0.8px_var(--border)] px-3 lg:min-h-dvh">
          <Header onMenu={() => (isDesktop ? setCollapsed(false) : setDrawer(true))} sidebarHidden={sidebarHidden} />

          <div className="flex w-full flex-col px-1 py-4">
            <div className="flex w-full flex-col gap-6">
              {/* Greeting */}
              <div className="flex w-full flex-wrap items-start justify-between gap-4">
                <div className="flex animate-rise flex-col items-start gap-4 leading-none">
                  <h1 className="flex h-6 items-center gap-[0.25em] whitespace-nowrap text-2xl font-medium text-foreground">
                    Hello, Achmad Hakim
                    <span aria-hidden className="inline-block origin-[70%_70%] animate-[wave_1.8s_ease-in-out_600ms_1]">👋</span>
                  </h1>
                  <p className="text-[13px] text-secondary-foreground">Here are the latest insights from your customer interactions.</p>
                </div>
                <div className="flex animate-rise items-start gap-2 [animation-delay:60ms]">
                  <PeriodSelect value={period} onChange={setGlobal} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="Dashboard options">
                        <Icon name="more" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => window.location.reload()}>Refresh data</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => window.print()}>Print dashboard</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setGlobal("last-week")}>Reset range</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col gap-4 min-[1400px]:flex-row">
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <KpiCards data={KPIS[period]} compare={compare} periodKey={period} />
                    <TicketTrend period={trendPeriod} onPeriodChange={setTrendPeriod} />
                  </div>
                  <LatestUpdates className="w-full shrink-0 min-[1400px]:w-[332px]" />
                </div>
                <SlaTable />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
