import { tf, useTFData } from "@/lib/tf"
import { RoomView } from "./room"
import { ConvTab, TabStrip } from "./chat-page"

/** The same tabs and messages as the Chat page, sized to fill the pop-up window. */
export function ChatWindowBody() {
  const d = useTFData(() => tf().chat())
  const cur = d.tabs.find((t) => t.id === d.cur) || d.tabs[0]
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TabStrip d={d} />
      {cur ? (d.conv ? <ConvTab key={cur.id} /> : <RoomView key={cur.id} tab={cur} />) : null}
    </div>
  )
}
