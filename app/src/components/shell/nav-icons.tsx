import {
  CalendarDays, Coins, Crosshair, Fish, Flag, Gem, Hexagon, House, ListChecks, ListTodo,
  Orbit, Pickaxe, ScrollText, Shield, Swords, Target, TrendingUp, Trophy, Users, type LucideIcon,
} from "lucide-react"

export const PLACE_ICON: Record<string, LucideIcon> = {
  home: House, plan: ListChecks, farm: Pickaxe, today: CalendarDays, squad: Users,
}
export const PAGE_ICON: Record<string, LucideIcon> = {
  home: House, ranks: Trophy, mastery: TrendingUp, goals: Target, tasks: ListTodo, missions: Orbit,
  quests: ScrollText, farm: Crosshair, resources: Gem, relics: Hexagon, world: Fish, market: Coins,
  arsenal: Swords, frames: Shield, today: CalendarDays, synd: Flag, friends: Users,
}
