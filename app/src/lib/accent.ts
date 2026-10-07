import { useEffect, useState } from "react"

/** Colour choices. "rank" follows your Mastery rank; the rest stay fixed. */
export type AccentChoice = "rank" | "bronze" | "silver" | "gold" | "radiant" | "jade"
export const ACCENTS: { value: AccentChoice; label: string; hint: string }[] = [
  { value: "rank", label: "Follow my rank", hint: "Bronze, then silver at MR 10, gold at MR 20, gold and jade at Legendary" },
  { value: "bronze", label: "Bronze", hint: "" },
  { value: "silver", label: "Silver", hint: "" },
  { value: "gold", label: "Gold", hint: "" },
  { value: "radiant", label: "Legendary", hint: "" },
  { value: "jade", label: "Jade", hint: "" },
]

const KEY = "tf-accent"
const read = (): AccentChoice => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '"rank"')
    return ACCENTS.some((a) => a.value === v) ? v : "rank"
  } catch {
    return "rank"
  }
}

/** The tier for a Mastery rank: bronze below 10, silver below 20, gold below 30, then Legendary. */
export const tierFor = (mr: number) => (mr >= 30 ? "radiant" : mr >= 20 ? "gold" : mr >= 10 ? "silver" : "bronze")

/** Applies the accent colour for your rank tier (or the one you picked). */
export function useAccentChoice() {
  const [choice, setChoice] = useState<AccentChoice>(read)
  useEffect(() => {
    const on = () => setChoice(read())
    window.addEventListener("tf:accent", on)
    return () => window.removeEventListener("tf:accent", on)
  }, [])
  return choice
}
export function setAccent(c: AccentChoice) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    /* private mode: just this visit */
  }
  window.dispatchEvent(new Event("tf:accent"))
}
export function useAccent(mr: number) {
  const choice = useAccentChoice()
  useEffect(() => {
    const root = document.documentElement
    const tier = choice === "rank" ? tierFor(mr) : choice
    root.dataset.accent = tier
  }, [choice, mr])
  return { choice, tier: choice === "rank" ? tierFor(mr) : choice }
}
