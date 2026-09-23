import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { PERIODS, type Period } from "@/data/dashboard"
import { cn } from "@/lib/utils"
import { Icon } from "./card-shell"

export function PeriodSelect({
  value,
  onChange,
  variant = "outline",
  label = "Time range",
}: {
  value: Period
  onChange: (p: Period) => void
  variant?: "outline" | "surface"
  label?: string
}) {
  const current = PERIODS.find((p) => p.value === value)!
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="group/ps w-[117px] justify-between" aria-label={`${label}: ${current.label}`}>
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" />
            <span key={current.value} className="animate-fade">
              {current.label}
            </span>
          </span>
          <Icon
            name="arrow-down"
            size={12}
            className={cn("transition-transform duration-200 group-data-[state=open]/ps:rotate-180")}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as Period)}>
          {PERIODS.map((p) => (
            <DropdownMenuRadioItem key={p.value} value={p.value}>
              {p.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
