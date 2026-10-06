import { HaloSegmented } from "@/components/ui/halo-segmented"
import { tf } from "@/lib/tf"

/** Two related pages under one menu entry: a switch at the top moves between them. */
export const PAIRS = {
  goals: [{ value: "goals", label: "Gear goals" }, { value: "tasks", label: "To-do list" }],
  chart: [{ value: "missions", label: "Star chart" }, { value: "quests", label: "Quests" }],
}

export function PairTabs({ pair, current }: { pair: keyof typeof PAIRS; current: string }) {
  return <HaloSegmented className="self-start" value={current} onValueChange={(v) => v !== current && tf().go(v)} items={PAIRS[pair]} />
}
