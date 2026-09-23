import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { asset } from "@/lib/assets"
import { cn } from "@/lib/utils"

/** Checkbox [1.0] from the Figma table: 14px soft track + 12px raised knob, dark when checked. */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/cb peer relative size-4 shrink-0 rounded-[4px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        className
      )}
      {...props}
    >
      <span className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-[#e1e4ea] transition-colors duration-150 group-hover/cb:bg-[#d4d8e0] group-data-[state=checked]/cb:bg-[rgba(75,85,99,0.1)] group-data-[state=indeterminate]/cb:bg-[rgba(75,85,99,0.1)]" />
      <span className="absolute left-0.5 top-0.5 size-3 overflow-clip rounded-[3px] bg-white shadow-[0px_2.2px_3px_0px_rgba(27,28,29,0.12)] transition-colors duration-150 group-data-[state=checked]/cb:bg-primary group-data-[state=indeterminate]/cb:bg-primary">
        <CheckboxPrimitive.Indicator className="absolute left-1/2 top-1/2 flex size-2.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center data-[state=checked]:animate-pop">
          {props.checked === "indeterminate" ? (
            <span className="h-[1.2px] w-1.5 rounded-full bg-white" />
          ) : (
            <img src={asset("check-tick")} width={10} height={10} alt="" className="block size-2.5" />
          )}
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
