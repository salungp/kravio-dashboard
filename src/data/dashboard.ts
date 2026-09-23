export type Period = "last-week" | "last-month" | "last-quarter"

export const PERIODS: { value: Period; label: string; compare: string }[] = [
  { value: "last-week", label: "Last week", compare: "vs last week" },
  { value: "last-month", label: "Last month", compare: "vs last month" },
  { value: "last-quarter", label: "Last quarter", compare: "vs last quarter" },
]

export type Kpi = { value: number; decimals?: number; suffix?: string; delta: number }

export const KPIS: Record<Period, { tickets: Kpi; resolution: Kpi; sla: Kpi }> = {
  "last-week": {
    tickets: { value: 3484, delta: 7.1 },
    resolution: { value: 486, delta: 2 },
    sla: { value: 92, suffix: "%", delta: -1.3 },
  },
  "last-month": {
    tickets: { value: 14921, delta: 4.6 },
    resolution: { value: 471, delta: -0.8 },
    sla: { value: 94, suffix: "%", delta: 1.9 },
  },
  "last-quarter": {
    tickets: { value: 43207, delta: 12.4 },
    resolution: { value: 455, delta: 3.2 },
    sla: { value: 91, suffix: "%", delta: -2.1 },
  },
}

/**
 * Bar series. Heights are the exact Figma bar heights (px inside the 216px plot);
 * values use the same px→ticket scale as the design's "Tue : 584" callout.
 * Two bars per weekday label, matching the design's half-day cadence.
 */
export type Bar = { label: string; height: number }
const PX_PER_TICKET = 139 / 584
export const toValue = (h: number) => Math.round(h / PX_PER_TICKET)

export const BAR_LEFTS = [-22, 35, 91, 147, 203, 260, 317, 374, 431, 488, 545, 602, 659, 716, 773]
export const PLOT_W = 738
/** Weekday under each bar's centre on the 7-label x-axis (first/last bars bleed into the adjacent weeks). */
export const BAR_DAYS = ["Sat", "Sun", "Mon", "Mon", "Tue", "Tue", "Wed", "Wed", "Thu", "Thu", "Fri", "Fri", "Sat", "Sat", "Sun"]

const withDays = (heights: number[]): Bar[] => heights.map((height, i) => ({ label: BAR_DAYS[i], height }))

export const TREND: Record<Period, { total: number; delta: number; active: number; bars: Bar[] }> = {
  "last-week": {
    total: 4790,
    delta: 8,
    active: 5,
    bars: withDays([68, 139, 161, 95, 128, 139, 110, 139, 182, 161, 149, 161, 84, 170, 125]),
  },
  "last-month": {
    total: 19640,
    delta: 5,
    active: 8,
    bars: withDays([92, 118, 150, 131, 104, 163, 142, 120, 176, 158, 133, 170, 112, 146, 101]),
  },
  "last-quarter": {
    total: 58312,
    delta: 11,
    active: 11,
    bars: withDays([80, 97, 124, 142, 118, 131, 156, 149, 168, 143, 177, 190, 139, 162, 121]),
  },
}

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export const Y_TICKS = [800, 600, 400, 200, 0]

/* ---------- Latest updates ---------- */
export type Part = string | { strong: string }
export type Activity = {
  id: string
  kind: "ticket" | "user" | "repeat" | "alert" | "book" | "star"
  title: string
  time: string
  body: Part[]
  wrap?: boolean
}

export const ACTIVITY: Record<"today" | "yesterday" | "week", Activity[]> = {
  today: [
    { id: "a1", kind: "ticket", title: "Ticket Updated", time: "11:20 AM", body: ["Ticket ", { strong: "#2319" }, " SLA updated"] },
    { id: "a2", kind: "user", title: "New Client Added", time: "11:15 AM", body: ["PT. Alpha Indonesia registered"] },
    { id: "a3", kind: "repeat", title: "Agent Reassigned", time: "11:00 AM", body: ["Ticket ", { strong: "#2322" }, " moved to ", { strong: "Michael Wong" }] },
    { id: "a4", kind: "alert", title: "SLA Breach Risk", time: "10:45 AM", body: ["Ticket ", { strong: "#2320" }, ' "', { strong: "Login issue" }, '"'] },
    { id: "a5", kind: "book", title: "Knowledge Base", time: "10:30 AM", body: ['New article published: "', { strong: "Login Troubleshooting" }, '"'], wrap: true },
    { id: "a6", kind: "star", title: "Customer Feedback", time: "10:30 AM", body: ['"', { strong: "Great support response, thanks Sarah!" }, '"'], wrap: true },
    { id: "a7", kind: "ticket", title: "Ticket Closed", time: "09:58 AM", body: ["Ticket ", { strong: "#2311" }, " resolved by ", { strong: "Sarah Lee" }] },
    { id: "a8", kind: "user", title: "Agent Online", time: "09:02 AM", body: [{ strong: "John Doe" }, " started a shift"] },
  ],
  yesterday: [
    { id: "b1", kind: "alert", title: "SLA Breached", time: "05:40 PM", body: ["Ticket ", { strong: "#2298" }, " missed first response"] },
    { id: "b2", kind: "repeat", title: "Agent Reassigned", time: "03:12 PM", body: ["Ticket ", { strong: "#2301" }, " moved to ", { strong: "Sarah Lee" }] },
    { id: "b3", kind: "star", title: "Customer Feedback", time: "01:26 PM", body: ['"', { strong: "Fast fix on the billing bug" }, '"'], wrap: true },
    { id: "b4", kind: "ticket", title: "Ticket Updated", time: "11:05 AM", body: ["Ticket ", { strong: "#2305" }, " priority raised"] },
    { id: "b5", kind: "book", title: "Knowledge Base", time: "09:30 AM", body: ['Article updated: "', { strong: "Invoice Exports" }, '"'], wrap: true },
  ],
  week: [
    { id: "c1", kind: "user", title: "New Client Added", time: "Mon", body: ["PT. Nusantara Retail registered"] },
    { id: "c2", kind: "alert", title: "SLA Breach Risk", time: "Mon", body: ["3 tickets near ", { strong: "response SLA" }] },
    { id: "c3", kind: "ticket", title: "Bulk Update", time: "Tue", body: [{ strong: "42" }, " tickets tagged ", { strong: "billing" }] },
    { id: "c4", kind: "repeat", title: "Queue Rebalanced", time: "Wed", body: ["Workload shifted to ", { strong: "Tier 2" }] },
    { id: "c5", kind: "book", title: "Knowledge Base", time: "Thu", body: ['New article published: "', { strong: "SSO Setup Guide" }, '"'], wrap: true },
    { id: "c6", kind: "star", title: "CSAT Milestone", time: "Fri", body: ["CSAT reached ", { strong: "4.8 / 5" }] },
  ],
}

/* ---------- SLA monitoring ---------- */
export type Priority = "High" | "Medium" | "Low"
export type Status = "In Review" | "Delivered" | "In Progress"
export type Ticket = {
  id: string
  subject: string
  priority: Priority
  assignee: "John Doe" | "Sarah Lee" | "Michael Wong"
  status: Status
  created: string
  slaHours: number
}

export const TICKETS: Ticket[] = [
  { id: "#2319", subject: "Payment failed on invoice", priority: "High", assignee: "John Doe", status: "In Review", created: "2025-08-18", slaHours: 2 },
  { id: "#2320", subject: "Login issue", priority: "Medium", assignee: "Sarah Lee", status: "Delivered", created: "2025-08-19", slaHours: 1 },
  { id: "#2321", subject: "Feature request export", priority: "Low", assignee: "John Doe", status: "In Progress", created: "2025-08-19", slaHours: 24 },
  { id: "#2322", subject: "Contract renewal issue", priority: "Medium", assignee: "Michael Wong", status: "In Progress", created: "2025-08-20", slaHours: 9 },
]

export const slaLabel = (h: number) => (h >= 24 ? `${Math.round(h / 24)}d left` : `${h}h left`)
