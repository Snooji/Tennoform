/* Drawer: a panel that slides in from an edge and closes with a swipe. From coss.com's Drawer on 21st.dev
   (21st.dev/@coss.com/components/drawer), built on Base UI's Drawer like the rest of our components.
   Trimmed to the parts Tennoform uses and wired to our cn(); sits above the phone tab bar (z 80). */
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { XIcon } from "lucide-react"
import { createContext, useContext } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DrawerPosition = "right" | "left" | "top" | "bottom"
const DrawerContext = createContext<{ position: DrawerPosition }>({ position: "bottom" })
const directionMap: Record<DrawerPosition, DrawerPrimitive.Root.Props["swipeDirection"]> = { bottom: "down", left: "left", right: "right", top: "up" }

export function Drawer({ swipeDirection, position = "bottom", ...props }: DrawerPrimitive.Root.Props & { position?: DrawerPosition }) {
  return (
    <DrawerContext.Provider value={{ position }}>
      <DrawerPrimitive.Root swipeDirection={swipeDirection ?? directionMap[position]} {...props} />
    </DrawerContext.Provider>
  )
}

export const DrawerClose = (props: DrawerPrimitive.Close.Props) => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />

function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-[80] bg-black/45 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-sm transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-swiping:duration-0",
        className,
      )}
      data-slot="drawer-backdrop"
      {...props}
    />
  )
}

export function DrawerPopup({ className, children, showCloseButton = false, showBar = false, ...props }: DrawerPrimitive.Popup.Props & { showCloseButton?: boolean; showBar?: boolean }) {
  const { position } = useContext(DrawerContext)
  return (
    <DrawerPrimitive.Portal>
      <DrawerBackdrop />
      <DrawerPrimitive.Viewport className={cn("fixed inset-0 z-[80] touch-none", position === "bottom" && "grid grid-rows-[1fr_auto] pt-12")} data-slot="drawer-viewport">
        <DrawerPrimitive.Popup
          className={cn(
            "relative flex max-h-full min-h-0 w-full min-w-0 flex-col bg-popover text-popover-foreground shadow-lg outline-none transition-[transform,box-shadow,height] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform touch-none data-swiping:select-none data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
            position === "bottom" &&
              "row-start-2 rounded-t-2xl border-t pb-[env(safe-area-inset-bottom,0px)] transform-[translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))] data-ending-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)))] data-starting-style:transform-[translateY(calc(100%+env(safe-area-inset-bottom,0px)))] has-data-[slot=drawer-bar]:pt-2",
            className,
          )}
          data-slot="drawer-popup"
          {...props}
        >
          {showBar ? <DrawerBar /> : null}
          {children}
          {showCloseButton ? (
            <DrawerPrimitive.Close aria-label="Close" className="absolute end-2 top-2" render={<Button size="icon" variant="ghost" />}>
              <XIcon />
            </DrawerPrimitive.Close>
          ) : null}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex shrink-0 flex-col gap-1 px-4 pt-3 pb-3", className)} data-slot="drawer-header" {...props} />
)
export const DrawerTitle = ({ className, ...props }: DrawerPrimitive.Title.Props) => (
  <DrawerPrimitive.Title className={cn("font-heading text-lg leading-tight font-semibold", className)} data-slot="drawer-title" {...props} />
)
export const DrawerDescription = ({ className, ...props }: DrawerPrimitive.Description.Props) => (
  <DrawerPrimitive.Description className={cn("text-sm text-muted-foreground", className)} data-slot="drawer-description" {...props} />
)
/** The scrolling body. touch-auto lets its content scroll while the rest of the popup drags. */
export const DrawerPanel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="min-h-0 touch-auto overflow-y-auto overscroll-contain">
    <div className={cn("flex flex-col gap-2 px-3 pb-3", className)} data-slot="drawer-panel" {...props} />
  </div>
)
export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex shrink-0 flex-wrap gap-2 border-t bg-muted/60 px-4 pt-3 pb-3", className)} data-slot="drawer-footer" {...props} />
)
/** The grab handle at the top of a bottom sheet. */
export function DrawerBar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("flex h-5 shrink-0 touch-none items-center justify-center before:h-1 before:w-12 before:rounded-full before:bg-muted-foreground/40", className)}
      data-slot="drawer-bar"
      {...props}
    />
  )
}
