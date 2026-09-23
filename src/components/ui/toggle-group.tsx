import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function ToggleGroup({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root data-slot="toggle-group" className={cn("relative flex items-start gap-2", className)} {...props} />
}

/** Segmented tab: white outline at rest, dark gradient pill when selected (pill is painted by the parent indicator). */
function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "relative z-10 flex h-7 min-w-0 flex-1 items-center justify-center rounded-lg border-[0.8px] border-border bg-card pl-2.5 pr-2 text-xs font-medium leading-none text-secondary-foreground outline-none transition-[color,background-color,border-color,transform] duration-200 hover:bg-[#fafafa] active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-ring/40 data-[state=on]:border-transparent data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
