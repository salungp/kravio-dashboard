import * as React from "react"

import { asset } from "@/lib/assets"
import { cn } from "@/lib/utils"

/**
 * Gray card shell with the diagonal hatch vector from Figma ("Vector" 1639×560, 3% black).
 * `patternStyle` places the vector exactly as each card does in the design.
 */
export function CardShell({
  className,
  patternStyle,
  children,
  ...props
}: React.ComponentProps<"section"> & { patternStyle?: React.CSSProperties }) {
  return (
    <section
      className={cn("relative flex flex-col items-start overflow-clip rounded-xl bg-muted p-1 shadow-[inset_0_0_0_0.8px_var(--border)]", className)}
      {...props}
    >
      <img
        src={asset("card-pattern")}
        alt=""
        width={1639}
        height={560}
        className="pointer-events-none absolute block h-[560px] w-[1639px] max-w-none"
        style={patternStyle}
      />
      {children}
    </section>
  )
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("relative flex w-full shrink-0 items-center justify-between p-2", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("whitespace-nowrap text-sm font-medium leading-none text-secondary-foreground", className)} {...props} />
}

export const Icon = ({ name, size = 16, className }: { name: string; size?: number; className?: string }) => (
  <img src={asset(name)} width={size} height={size} alt="" className={cn("block shrink-0", className)} style={{ width: size, height: size }} />
)

/** Figma-style image that bleeds past its slot (stroke/shadow overflow): wrapper takes the inset, img fills it. */
export const InsetImg = ({
  name,
  w,
  h,
  inset,
  className,
}: {
  name: string
  w: number
  h: number
  inset: string
  className?: string
}) => (
  <span className={cn("pointer-events-none absolute block", className)} style={{ inset }}>
    <img src={asset(name)} alt="" width={w} height={h} className="block size-full max-w-none" />
  </span>
)
