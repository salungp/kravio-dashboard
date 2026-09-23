import { useCountUp } from "@/hooks/use-count-up"

type Props = {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  delay?: number
  duration?: number
  className?: string
}

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/** Count-up number. Screen readers get the final value, not the animated frames. */
export function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "", delay, duration, className }: Props) {
  const v = useCountUp(value, { delay, duration })
  const final = `${prefix}${fmt(value, decimals)}${suffix}`
  return (
    <span className={className}>
      <span aria-hidden>
        {prefix}
        {fmt(v, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  )
}
