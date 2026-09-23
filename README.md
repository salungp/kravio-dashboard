# Kravio — Support Dashboard

Front-end build of Figma node `845:1347` (Spark Pixel – Exploration).
React 19 + Vite + Tailwind CSS v4 + shadcn/ui (Radix primitives, `components.json` included).

## Run

```bash
npm install
npm run dev                    # http://localhost:5173
npm run build                  # static site in dist/
npx vite build --mode single   # one self-contained file: dist-single/index.html
```

## Structure

- `src/assets/` — every icon, sparkline, pattern and avatar exported from the Figma file.
- `src/components/ui/` — shadcn-style primitives (Button, InputGroup, Checkbox, DropdownMenu, Tooltip, ToggleGroup, Avatar).
- `src/components/dashboard/` — Sidebar, Header, KPI cards, Ticket Volume Trend chart, Latest Updates, SLA Monitoring table.
- `src/data/dashboard.ts` — all dashboard data (swap for your API).
- `src/index.css` — design tokens (colors, radius, easing) and motion keyframes.

## Interactions

- Count-up numbers on every KPI, the trend total and the activity count.
- Sparklines draw in; chart bars grow in with a stagger.
- Chart: hover, click or use ←/→ to move the highlighted bar, value tag and guide line.
- Time range menus switch datasets with animated transitions.
- Latest Updates: sliding segmented tabs, live search with highlight, empty state.
- SLA table: sort any column, search, filter by priority/status, select rows, row actions (status, reassign), CSV export.
- Sidebar: collapsible groups, active states, ⌘K / Ctrl+K focuses search, collapse button; drawer below 1024px.
- Respects `prefers-reduced-motion`.
# kravio-dashboard
