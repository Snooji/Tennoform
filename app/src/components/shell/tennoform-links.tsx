import { Heart, MessageSquare, Sparkles } from "lucide-react"

import { tf } from "@/lib/tf"

/** Support, feedback and what's new: one list used by the sidebar and the Home card. */
export const TF_LINKS = [
  { route: "donate", label: "Support Tennoform", icon: Heart, accent: true },
  { route: "feedback", label: "Send feedback", icon: MessageSquare, accent: false },
  { route: "about", label: "What's new", icon: Sparkles, accent: false, whatsNew: true },
] as const

/** Opens a link from TF_LINKS; "What's new" opens the About page at the changelog. */
export function openLink(l: (typeof TF_LINKS)[number], e?: React.MouseEvent) {
  if (!("whatsNew" in l)) return
  e?.preventDefault()
  tf().act("a", { href: "#about", "data-about": "changes" })
}
