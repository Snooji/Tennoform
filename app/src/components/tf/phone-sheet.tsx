import { useEffect, type ReactNode } from "react"

import { Drawer, DrawerDescription, DrawerFooter, DrawerHeader, DrawerPanel, DrawerPopup, DrawerTitle } from "@/components/ui/drawer"

declare global { interface Window { TF_SHEET_OPEN?: number } }

/** The phone's bottom sheet: drag the bar (or the sheet) down to close, tap outside, or press Back on Android.
    It counts itself in window.TF_SHEET_OPEN so the app's Back button closes it before leaving the page. */
export function PhoneSheet({ open, onOpenChange, title, description, children, footer }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    window.TF_SHEET_OPEN = (window.TF_SHEET_OPEN || 0) + 1
    const close = () => onOpenChange(false)
    window.addEventListener("tf:sheet-close", close)
    return () => { window.TF_SHEET_OPEN = Math.max(0, (window.TF_SHEET_OPEN || 1) - 1); window.removeEventListener("tf:sheet-close", close) }
  }, [open, onOpenChange])
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPopup showBar showCloseButton className="max-h-[calc(92dvh-1rem)]">
        <DrawerHeader className="border-b pr-12">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription className={description ? undefined : "sr-only"}>{description || title}</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel className="pt-3">{children}</DrawerPanel>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerPopup>
    </Drawer>
  )
}
