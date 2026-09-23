import * as React from "react"

import { cn } from "@/lib/utils"

/** Input shell: icon + native input + optional trailing addon, styled per Figma "Input" component. */
function InputGroup({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="input-group"
      className={cn(
        "group/input flex h-8 cursor-text items-center gap-2 overflow-clip rounded-lg border-[0.8px] bg-card py-2 pl-2.5 pr-2 transition-[border-color,box-shadow] duration-150 hover:border-[#d1d5db] focus-within:border-[#9ca3af] focus-within:shadow-[0_0_0_3px_rgba(156,163,175,0.18)]",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        "min-w-0 flex-1 bg-transparent text-[13px] leading-none text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden",
        className
      )}
      {...props}
    />
  )
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="input-group-addon" className={cn("flex shrink-0 items-center", className)} {...props} />
}

export { InputGroup, InputGroupInput, InputGroupAddon }
