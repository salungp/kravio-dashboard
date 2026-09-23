import { useEffect, useRef, useState } from "react"

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Animates a number from its previous value (0 on mount) to `target`. */
export function useCountUp(target: number, { duration = 1400, delay = 0 } = {}) {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0)
  const from = useRef(prefersReducedMotion() ? target : 0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target)
      from.current = target
      return
    }
    const start = from.current
    let raf = 0
    let t0 = 0
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        if (!t0) t0 = now
        const p = Math.min(1, (now - t0) / duration)
        const v = start + (target - start) * easeOutExpo(p)
        from.current = v
        setValue(v)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}
