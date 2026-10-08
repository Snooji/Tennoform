import { Component, type ReactNode } from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

/** If a page fails to load or crashes, say so and offer a reload, instead of leaving the screen blank. */
export class PageError extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="mx-auto flex w-full max-w-xl flex-col items-start gap-3 px-4 py-10 md:px-6">
        <h1 className="font-heading text-2xl font-semibold">This page didn't load</h1>
        <p className="text-sm text-muted-foreground">
          Tennoform was probably just updated, or the connection dropped. Reloading gets the latest version; your progress is saved.
        </p>
        <Button className="h-10 px-4" onClick={() => location.reload()}>
          <RefreshCw /> Reload
        </Button>
      </div>
    )
  }
}
