import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Icon, InsetImg } from "./card-shell"

export function Header({ onMenu, sidebarHidden }: { onMenu: () => void; sidebarHidden: boolean }) {
  return (
    <header className="flex h-[52px] w-full items-center justify-between px-3 py-3.5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open sidebar"
          className={`-my-1 -ml-1 rounded-md p-1 outline-none transition-colors hover:bg-black/[0.05] focus-visible:ring-[3px] focus-visible:ring-ring/40 ${sidebarHidden ? "" : "lg:hidden"}`}
        >
          <Icon name="sidebar-right" className="rotate-180" />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-4">
          <a href="#" className="group/bc flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
            <Icon name="hd-dashboard" />
            <span className="whitespace-nowrap text-sm leading-none text-muted-foreground transition-colors group-hover/bc:text-foreground">Overview</span>
          </a>
          <span className="relative h-2.5 w-1.5 shrink-0" aria-hidden>
            <InsetImg name="breadcrumb-slash" w={7} h={11} inset="-2.57% -7.15%" />
          </span>
          <span aria-current="page" className="whitespace-nowrap text-sm font-medium leading-none text-foreground">
            Dashboard
          </span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="group/bell -m-1 size-6">
              <Icon name="bell" className="origin-top transition-transform group-hover/bell:animate-[ring_600ms_ease-in-out]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Settings" className="group/set -m-1 size-6">
              <Icon name="hd-settings" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/set:rotate-90" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
