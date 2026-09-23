import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium leading-none outline-none select-none transition-[background-color,border-color,box-shadow,transform,color] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/40 [&_img]:pointer-events-none [&_img]:shrink-0",
  {
    variants: {
      variant: {
        // White control, gray-200 hairline (page-level controls)
        outline:
          "rounded-lg border-[0.8px] border-border bg-card text-secondary-foreground hover:border-[#d1d5db] hover:bg-[#fcfcfc] hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] data-[state=open]:bg-[#fcfcfc] data-[state=open]:border-[#d1d5db]",
        // White control, 10% black hairline (controls inside cards)
        surface:
          "rounded-lg border-[0.8px] border-input bg-card text-secondary-foreground hover:bg-[#fcfcfc] hover:shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] data-[state=open]:bg-[#fcfcfc]",
        ghost: "rounded-md text-secondary-foreground hover:bg-black/[0.04]",
        primary:
          "rounded-lg border border-primary bg-[linear-gradient(180deg,#37475d_0%,#1f2937_64.7%)] text-primary-foreground hover:brightness-110",
      },
      size: {
        default: "h-8 gap-1.5 pl-2.5 pr-2 text-xs",
        sm: "h-7 gap-1.5 px-2 text-xs",
        icon: "size-8 p-2",
        "icon-sm": "size-6 p-1",
      },
    },
    defaultVariants: { variant: "outline", size: "default" },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
