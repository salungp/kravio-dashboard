// Every static asset exported from the Figma file (node 845:1347), resolved to a bundled URL.
const files = import.meta.glob("../assets/*", { eager: true, query: "?url", import: "default" }) as Record<string, string>

export const asset = (name: string): string => {
  const hit = Object.entries(files).find(([p]) => p.replace(/^.*\//, "").replace(/\.\w+$/, "") === name)
  if (!hit) throw new Error(`Missing asset: ${name}`)
  return hit[1]
}
