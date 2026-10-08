import { useEffect, useState, useSyncExternalStore } from "react"

/** What the existing Tennoform app exposes on window.TF (see src/js/465-bridge.js). */
export type TFState = {
  route: string
  title: string
  place: { id: string; label: string } | null
  mr: number
  mrLabel: string
  nextLabel: string
  xp: number
  next: number
  pct: number
  toNext: number
  name: string
  signedIn: boolean
  canAcct: boolean
  acctName: string
  acctEmail: string
  admin: boolean
  unread: number
  theme: "dark" | "light" | "auto" | "foundry"
  demo: boolean
  isNew: boolean
  qs: boolean
}
export type TFNavPlace = { id: string; label: string; pages: { route: string; label: string }[] }
export type TFHit = { name: string; group: string; act: string; sub: string; img: string }
export type TFApi = {
  state(): TFState
  nav(): TFNavPlace[]
  menu(): { route: string; label: string }[]
  search(q: string): TFHit[]
  open(act: string): void
  go(route: string): void
  google(): void
  signOut(): void
  account(): void
  theme(t: TFState["theme"]): void
  logo(): string
  share(): void
  keys(): void
  refresh(): void
  home(): HomeData
  act(tag: string, attrs: Record<string, string>): void
  nuDone(i: number): void
  nuSnooze(i: number): void
  nuUnsnooze(): void
  addTaskFrom(key: string, label: string): void
  taskDone(id: string, v: boolean): Promise<void>
  addTask(text: string): boolean
  sync(): void
  ranks(fresh?: boolean): RanksData
  ranksSet(o: { cat?: string; q?: string; f?: string; s?: string; t?: string }): void
  ranksMore(all?: boolean): void
  ranksRefresh(): void
  setRank(n: string, r: number): void
  community(): CommunityData
  communitySet(o: { room?: string }): void
  communitySend(text: string): Promise<boolean>
  chatDelete(id: string): void
  chat(): ChatPageData
  alerts(): AlertsData
  alertPrefsSet(o: Partial<AlertPrefs>): void
  alertDismiss(id: string): void
  alertShowHidden(): void
  alertNotify(on: boolean): Promise<void>
  history(): HistoryData
  isRev(k: string): boolean
  sortRev(k: string): void
  sell(): SellData | null
  sellOpen(n: string): void
  sellClose(): void
  sellable(n: string): boolean
  avatarSet(): void
  avatarRemove(uid?: string): void
  myAvatar(): string
  roomBgSet(): void
  roomBgRemove(): void
  leadData(): LeadData
  leadReload(): void
  leadToggle(room: string, uid: string): void
  person(uid: string): { rel: "me" | "friend" | "pending" | "asked" | "blocked" | "none"; av: string; signed: boolean }
  friendAddUid(uid: string, name: string): void
  blockPerson(uid: string, name: string): void
  unblockPerson(uid: string): void
  chatGo(id: string, nav?: boolean): void
  chatCloseTab(id: string): void
  modData(): ModData
  modReload(): void
  modPublish(id: string): void
  modRemove(id: string, ban: boolean): void
  modBan(uid: string, name: string, reason: string): void
  modUnban(uid: string): void
  playerStats(): PlayerStats
  playerStatsReload(): void
  collection(): CollectionData
  collectionSet(o: { f?: string; q?: string }): void
  showInRanks(n: string): void
  marketMods(): MarketMods
  marketModsSet(o: { q?: string; kind?: string; sort?: string; more?: boolean }): void
  setOwned(n: string, own: boolean, quiet?: boolean): void
  clearRank(n: string): void
  howToGet(n: string): { text: string; craft: boolean; wiki: string }
  maxAll(): number
  farm(): FarmData
  farmSet(o: { q?: string; ty?: string; cat?: string; unv?: boolean }): void
  farmClear(): void
  farmMore(): void
  farmPick(key: string | null): void
  island(el: HTMLElement | null): void
  today(): TodayData
  todaySet(o: { ckF?: string; fiF?: string; fiM?: string }): void
  ckTick(id: string, v: boolean): void
  ckPin(id: string): void
  ckHide(id: string): void
  ckAdd(text: string, per: string): boolean
  liveTask(text: string, expiry: string): void
  fisRelics(era: string): void
  retryLive(): void
  liveInfo(): LiveInfo
  syncStatus(): { state: "off" | "none" | "stale" | "ok" | "busy"; at: string; linked: boolean }
  feeds(): Feed[]
  ach(): AchData
  achSet(p: string): void
  logUndo(id: string): void
  tasks(): TasksData
  tasksSet(o: { f?: string; s?: string }): void
  taskUndone(id: string): Promise<void>
  taskEdit(id: string, o: { note?: string; rep?: string; due?: string; title?: string }): void
  taskDel(id: string): void
  taskClearDone(): void
  taskInvite(id: string, uid: string): void
  goals(): GoalsData
  goalsSet(o: { s?: string; short?: boolean }): void
  goalRemove(n: string): void
  setInv(n: string, v: string): void
  quests(): QuestsData
  questsSet(o: { f?: string }): void
  questTick(n: string, v: boolean): void
  questUpto(n: string): void
  questFocused(): void
  mastery(): MasteryData
  masterySet(o: { tab?: string; target?: string }): void
  gearTick(n: string, v: boolean): void
  itemTree(n: string, note?: string): string
  helperSet(m: string): void
  chart(): ChartData
  chartSet(o: { p?: string; q?: string; type?: string; sort?: string; hide?: boolean }): void
  nodeTick(key: string, v: boolean): void
  planetAll(p: string, mode: "n" | "sp"): void
  synd(): SyndData
  syndSet(o: { f?: string; s?: string; hide?: boolean }): void
  synSet(n: string, o: { r?: string; s?: string }): void
  res(): ResData
  resSet(o: { q?: string; f?: string }): void
  resPick(n: string | null): void
  frames(): FramesData
  framesSet(o: { f?: string; frame?: string; build?: string; budget?: boolean }): void
  world(): WorldData
  worldSet(o: { tab?: string; region?: string; rarity?: string; time?: string }): void
  market(): MarketData
  marketSet(o: { tab?: string; q?: string; f?: string; sort?: string }): void
  marketMore(): void
  whisper(text: string): void
  relics(): RelicsData
  relicsSet(o: Partial<Record<"tab" | "era" | "sort" | "raq" | "rae" | "duq" | "duf" | "duo", string>>): void
  relAdj(r: string, k: string, d: number): void
  relSet(r: string, k: string, v: string): void
  setTraces(v: string): void
  setDup(n: string, v: string): void
  planSet(o: { ref?: string; squad?: string; era?: string; sort?: string; q?: string; own?: boolean }): void
  arsenal(): ArsenalData
  arsenalSet(o: Partial<Record<"tab" | "cat" | "own" | "lf" | "ls" | "arq" | "art" | "ars" | "aro" | "kmt" | "kms" | "sel" | "bi", string>>): void
  arcAdj(n: string, d: number): void
  arcSet(n: string, v: string): void
  lichSet(n: string, o: { e?: string; b?: string }): void
  tenno(): TennoData
  tennoSet(o: { tab?: string; q?: string }): void
  inventoryInfo(): { at: string; canUndo: boolean; last: Record<string, number> | null }
  importInventory(text: string): Promise<{ ok: boolean; msg: string }>
  undoSync(): void
  support(): SupportData
  copy(text: string, msg?: string): void
  feedback(): FeedbackData
  feedbackSet(o: { kind?: string }): void
  feedbackSend(kind: string, text: string, contact: string): Promise<boolean>
  about(): AboutData
  admin(): AdminData
  adminSet(o: { tab?: string; filter?: string }): void
  adminRecheck(): void
  fbReload(): void
  fbDone(id: string): void
  fbStatus(id: string, status: "seen" | "working" | "done"): void
  fbCopy(id: string): void
  fbDel(id: string): void
  donAdd(o: { kind: string; amount: string; who: string; date: string; note: string }): Promise<boolean>
  donDel(id: string): Promise<void>
  donReload(): void
  donCSV(): void
  squad(): SquadData
  squadSet(o: { chat?: string | null; newGroup?: boolean }): void
  friendAdd(code: string): void
  friendAccept(id: string): void
  friendDecline(id: string): void
  friendRemove(uid: string): void
  friendBlock(uid: string): void
  friendReport(uid: string): void
  msgSend(text: string): Promise<boolean>
  inviteTask(id: string): void
  inviteAnswer(id: string, ok: boolean): void
  groupCreate(name: string, uids: string[]): Promise<boolean>
  groupAdd(uid: string): void
  groupLeave(): void
  resetView(): void
  wayTask(n: string): void
  guides(): GuidesData
  guidesSet(o: { filter?: string; q?: string; sel?: string | null }): void
  guideStep(id: string, i: number, v: boolean): void
  guideReset(id: string): void
  guideTask(id: string): void
  buildLib(): BuildLibData
  modInfo(n: string): ModInfo | null
  buildInsight(id: string, ov?: { mods: string[]; arcanes: string[] }): BuildInsight | null
  buildLibSet(o: { q?: string; kind?: string; src?: string; sort?: string; sel?: string | null; more?: boolean }): void
  buildLibReload(): void
  buildGoal(id: string): void
  buildGoalRemove(id: string): void
  buildCopy(id: string): void
  buildVote(id: string, v: 1 | -1): void
  myBuilds(): MyBuildsData
  myBuildEdit(o: null | { id?: string; item?: string }): void
  myBuildSave(d: BuildDraft): boolean
  myBuildDel(id: string): void
  myBuildPublish(id: string): void
  myBuildUnpublish(id: string): void
  sharedDelete(doc: string): void
}
/** An existing handler to run: the bridge builds an element with these attributes and clicks it. */
export type TFAction = { tag: "a" | "button"; attrs: Record<string, string> }
export type HomeNext = {
  i: number; id: string; title: string; why: string; steps: string[]; done: boolean; doneLabel: string; img: string
  open: TFAction | null; task: { has: boolean; key: string; label: string } | null
}
export type HomeTile = { k: string; v: string; x: string; route: string; ttab?: string; done?: number; total?: number }
export type HomeData = {
  name: string; mr: number; mrLabel: string; mrShort: string; inGame: string; maxed: number
  xp: number; next: number; toNext: number; nextLabel: string; pct: number; parts: { label: string; xp: number }[]
  action: "link" | "sync" | "plan"; since: string[]; foundryReady: number
  upNext: HomeNext[]; snoozed: number; today: HomeTile[]; doneToday: { n: number; xp: number }
  goals: { name: string; img: string; done: number; total: number }[]; goalCount: number
  tasks: { id: string; title: string; kind: string; due: string; over: boolean; rep: string; open: TFAction | null }[]; taskCount: number
  showSign: boolean; demo: boolean; stage: string
}
export type CollectionItem = { n: string; img: string; r: number; mx: number; has: boolean; done: boolean }
export type CollectionData = { f: string; q: string; owned: number; mastered: number; level: number; total: number; inv: number
  cats: { id: string; label: string; owned: number; mastered: number; level: number; total: number; items: CollectionItem[] }[] }
export type PlayerStats = { loading: boolean; err: string; data: { live: number; hour: number; dau: number; wau: number; mau: number; total: number; tracked: number; hist: { d: string; n: number }[]; ago: string } | null }
export type SellData = {
  n: string; url: string; low: number | null; avg: number | null; a30: number | null; v7: number; quick: number | null; fair: number | null
  du: number | null; rank: boolean; date: string; sellers: { name: string; price: number; rank: number | null; status: string }[]; chatQuick: string; chatFair: string
}
export type AlertPrefs = { baro: boolean; resurgence: boolean; fissure: boolean; notify: boolean }
export type AlertItem = { id: string; kind: "baro" | "resurgence" | "fissure"; title: string; text: string; items: string[]; href: string }
export type AlertsData = { prefs: AlertPrefs; live: boolean; list: AlertItem[]; hidden: number; canNotify: boolean; perm: string }
type HistPoint = { xp: number; mr: number; mastered: number; owned: number; nodes: number }
type HistDelta = { xp: number; mastered: number; owned: number; nodes: number; since: string } | null
export type HistoryData = { points: (HistPoint & { d: string })[]; now: HistPoint; week: HistDelta; month: HistDelta; first: string }
export type ChatTab = { id: string; label: string; title: string; hint: string; kind: "public" | "clan" | "alliance" | "friend" | "group"; unread: number; closable: boolean }
export type ChatPageData = { tabs: ChatTab[]; cur: string; conv: boolean; signed: boolean; synced: boolean; openable: { id: string; label: string; kind: "friend" | "group" }[] }
export type CommunityMsg = { id: string; who: string; text: string; time: string; mine: boolean; uid: string; held: boolean; av: string }
export type LeadData = { err: string; loading: boolean; rooms: { id: string; label: string; members: { uid: string; name: string; lead: boolean }[] }[] }
export type CommunityData = { hosted: boolean; ready: boolean; signed: boolean; admin: boolean; banned: boolean; room: string; synced: boolean
  rooms: { id: string; label: string; hint: string; kind: "public" | "clan" | "alliance" }[]; loading: boolean; err: string; msgs: CommunityMsg[]
  bg: string; lead: boolean; leadRoom: boolean; myAv: string }
export type ModData = { err: string; loading: boolean
  list: { id: string; room: string; uid: string; name: string; text: string; flag: string; at: string }[]
  bans: { uid: string; name: string; reason: string; at: string }[] }
export type RanksExtra = { owned?: number; signedIn?: boolean }
export type RankItem = { n: string; img: string; mr: number; r: number; mx: number; xp: number; max: number; per: number; prime: boolean; vaulted: boolean; resurgence: boolean; owned: boolean; notOwned: boolean; has: boolean; relics: boolean }
export type RanksData = {
  cat: string; q: string; f: string; s: string; t: string
  cats: { id: string; label: string; m: number; t: number }[]
  island: string; items: RankItem[]; total: number; shown: number; notMax: number
  head: { label: string; m: number; t: number; p: number; x: number; search: boolean }
}
export type FarmItem = { n: string; t: string; label: string; key: string; xp: number; left: number; img: string }
export type FarmData = {
  q: string; ty: string; cat: string; unv: boolean
  types: { value: string; label: string }[]; cats: { value: string; label: string; n: number }[]
  total: number; count: number; items: FarmItem[]; more: number; filtered: boolean
  sel: string; selName: string; detail: string
  way: WayDetail | null
}
export type LiveList = { head: string; list: { t: string; s: string; n: string }[] }
export type CheckRow = {
  id: string; per: "d" | "w"; title: string; desc: string; gate: string; locked: boolean; done: boolean; doneAt: number
  pinned: boolean; hidden: boolean; custom: boolean; resetIn: string; resetAt: string; endIso: string; hasTask: boolean
  link: { route: string; label: string } | null; live: LiveList | null
}
type Tasky = { task: string; hasTask: boolean; expiry: string; left: string }
export type TodayLive = {
  cycles: { name: string; state: string; left: string }[]
  sortie?: Tasky & { boss: string; faction: string; variants: { t: string; s: string; n: string }[] }
  archon?: Tasky & { boss: string; missions: { t: string; s: string }[] }
  baro?: { here: boolean; gone: boolean; left: string; location: string; inv: { item: string; ducats: number; credits: number }[] }
  steel?: { name: string; cost: number }
  arbitration?: Tasky & { type: string; node: string; enemy: string }
  nightwave?: (Tasky & { id: string; title: string; desc: string; rep: number; kind: string; done: boolean })[]
  fissures: {
    era: string; mode: string; need: { era: string; relics: string[]; more: number }[]
    list: (Tasky & { id: string; tier: string; need: boolean; mission: string; node: string; hard: boolean; storm: boolean; mine: number })[]
  }
  invasions: { id: string; node: string; desc: string; rewards: string; good: boolean; pct: number }[]
}
export type LiveInfo = { state: "ok" | "loading" | "delayed" | "stale" | "error" | "offline"; conn: string; fresh: string; at: string; ended: string[]; busy: boolean; retry: boolean }
export type Feed = { id: string; name: string; k: "ok" | "warn" | "bad" | "off"; t: string; retry: boolean }
export type TodayData = {
  filter: string; rows: CheckRow[]; hiddenCount: number; hosted: boolean
  tiles: { k: string; v: string; x: string; done?: number; total?: number }[]
  live: TodayLive | null; liveState: "ok" | "loading" | "error" | "offline"
}
export type AchData = {
  period: "today" | "week" | "all"
  tiles: { k: string; v: string; x: string }[]
  days: { label: string; n: number; xp: number; today: boolean }[]
  groups: { d: string; items: { id: string; k: string; label: string; time: string; extra: string; xp: number; canUndo: boolean }[] }[]
  note: string; empty: boolean
}
export type TaskRow = {
  id: string; title: string; kind: string; done: boolean; due: string; over: boolean; rep: string; note: string
  with: string[]; from: string; open: TFAction | null
}
export type TasksData = {
  filter: string; sort: string; todo: number; done: number; signedIn: boolean
  friends: { uid: string; name: string }[]; list: TaskRow[]
}
export type BuildGoal = { id: string; from: string; item: string; img: string; name: string; have: number; total: number; missing: ModSlot[] }
export type GoalsData = {
  bgoals: BuildGoal[]
  sort: string; short: boolean; credits: number
  goals: { name: string; img: string; done: number; total: number; xp: number; built: boolean; vault: { kind: "now" | "vaulted" | "farmable"; text: string } | null }[]
  shop: { n: string; need: number; have: number | null; left: number; where: string; task: { has: boolean; key: string; label: string } }[]
  relics: { era: string; relics: string[] }[]
}
export type QuestRow = {
  guide: string
  n: string; id: string; done: boolean; locked: boolean; desc: string; wiki: string
  req: { text: string; quest: string; done: boolean }[]; rewards: { text: string; go: string; left: number; xp: number }[]
  hasTask: boolean; upto: boolean
}
export type QuestsData = {
  filter: string; next: string; focus: string; total: number; done: number
  groups: { name: string; done: number; total: number; quests: QuestRow[] }[]
}
export type GearRow = { n: string; img: string; mr: number; rk: number; xp: number; done: boolean; price: string; note: string }
export type HelperData = {
  mode: "easy" | "relics" | "plat"
  leveling?: { n: string; img: string; rank: number; mx: number; left: number }[]
  built?: { n: string; img: string; xp: number; state: string }[]
  intr?: { n: string; left: number; max: number }[]; total?: number; relicCount?: number
  items: { n: string; img: string; xp: number; p?: number; cost?: number; useSet?: boolean; per1k?: number; parts: { full: string; p?: number; plat?: number; relics?: string[] }[] }[]
}
export type MasteryData = {
  tab: string; cur: number
  target?: string; targetLabel?: string; targets?: { value: string; label: string }[]
  need?: number; gearLeft?: number; nx?: number; sx?: number; nodesLeft?: number; spLeft?: number; overflow?: boolean
  groups?: { title: string; xp?: number; open?: boolean; items: GearRow[] }[]
  ladder?: { m: number; label: string; xp: number; reached: boolean; next: boolean; trades: number; cap: number; quests: string[]; gear: GearRow[] }[]
  sheetXp?: number
  craft?: { title: string; recipes: { recipe: string; xp: number; note: string; items: GearRow[] }[] }[]
  xpHtml?: string
  helper?: HelperData
  route?: RouteStep[]; routeTotal?: number
}
export type RouteStep = {
  id: string; title: string; how: string; xp: number; count: number; unit: string; link: string; kind: "gear" | "nodes" | "intr" | "info"
  locked?: boolean; reach: boolean; beyond: boolean; before: number; after: number; mrAfter: string
  items: GearRow[]; more: number; pick: number; planets?: { p: string; n: number; xp: number }[]
}
export type JunctionRow = { id: string; label: string; from: string; done: boolean; sp: boolean }
export type ChartData = {
  sel: string; total: number; nd: number; sd: number
  jt?: number; jd?: number; xp?: number; xpMax?: number
  planets?: { name: string; colors: string[]; done: number; sp: number; total: number }[]
  junctions: JunctionRow[]; juncHtml?: string
  colors?: string[]; xd?: number; type?: string; types?: string[]; sort?: string; hide?: boolean; q?: string; resources?: string[]; hasTask?: boolean
  nodes?: { id: string; name: string; type: string; lv: string; xp: number; ds: boolean; runs: number; done: boolean; sp: boolean }[]
}
export type SyndCard = {
  n: string; color: string; kind: string; locked: boolean; gate: string; synced: boolean; set: boolean; hasRanks: boolean
  rank: number; top: number; title: string; standing: number; max: number | null; pct: number; ready: boolean
  next: { t: string; in: number; days: number; cr: number; items: { q: number; n: string; go: string }[] } | null
  dailyLeft: number | null; effects: { ally: string; opp: string; enemy: string; warn: string[] } | null
  earn: { now: string[]; later: string[] } | null; mrxp: number
  offers: { n: string; cost: number; nextRank: boolean; go: string; left: number; xp: number }[]
  ranks: { value: string; label: string }[]; hasTask: boolean
}
export type SyndData = {
  filter: string; sort: string; hide: boolean; cap: number; factionLeft: number | null; synced: boolean; reset: string
  nightwave: { t: string; s: number; r: number }[]; list: SyndCard[]
}
export type ResRow = { n: string; have: number | null; label: string; need: number }
export type ResData = { q: string; filter: string; sel: string; total: number; list: ResRow[] | null; main: ResRow[]; rest: ResRow[]; detail: string }
export type ModSlot = { slot: string; m: string; key: string; pol: string; done: boolean; price: string; src: string; seller: string; fx?: string }
export type ModInfo = {
  n: string; arc: boolean; key: string; owned: boolean; loading: boolean; type: string; fits: string; rarity: string; polarity: string
  rank: number | null; drain: number | null; fx: string[]; fx0: string[]; augment: boolean
  drops: { where: string; chance: number }[]; moreDrops: number; src: string
  tradable: boolean; wfm: string; a7: number | null; a30: number | null; v7: number | null; date: string
  sellers: { name: string; price: number; qty: number; rank: number | null; status: string; whisper: string }[]
}
export type BuildInsight = {
  ready: boolean; failed: boolean; kind: "frame" | "weapon" | "other"
  rows: { k: string; from: string; to: string; note: string; gain: number }[]
  elements: { t: string; v: number; from: string[] | null }[]
  cond: { m: string; t: string }[]; highlights: string[]; missing: string[]
}
export type FramesData = {
  filter: string; filteredEmpty: boolean; list: string[]; name: string; img: string; base: string; prime: string; baseVer: string; tree: string
  builds: { value: string; label: string }[]; bi: string; budget: boolean
  build: { role: string; helminth: string; notes: string; mods: ModSlot[]; arcanes: ModSlot[] } | null
}
export type Linked = { n: string; go: string }
export type WorldData = {
  tab: "fish" | "mine"; region: string; regions: string[]
  rarity?: string; time?: string; times?: string[]; cycle?: string; caught?: number; total?: number
  info?: { spears: string; vendor: string; use: string; tips: string[] }
  fish?: { n: string; key: string; done: boolean; rarity: string; bio: string; time: string; spear: string; bait: string; spots: string[]; gives: Linked[]; hasTask: boolean }[]
  spots?: string[]; vendor?: string
  ores?: { n: string; key: string; done: boolean; rarity: string; kind: string; go: string; hasTask: boolean }[]
  cutters?: { n: string; key: string; done: boolean; where: string; desc: string }[]; tips?: string[]
}
export type VaultCard = { n: string; c: string; img: string; text: string }
export type MarketModRow = { n: string; kind: "Mod" | "Arcane"; type: string; rar: string; a7: number | null; v7: number; seller: { name: string; price: number; rank: number | null; wh: string } | null; url: string }
export type MarketMods = { q: string; kind: string; sort: string; total: number; count: number; more: number; rows: MarketModRow[] }
export type MarketData = {
  tab: "sets" | "vault" | "mods"; snapshot: string
  q?: string; filter?: string; sort?: string; total?: number; count?: number; more?: number
  sets?: { n: string; base: string; img: string; vault: { kind: "now" | "vaulted" | "farmable"; text: string } | null; left: number; xp: number; price: number | null; meta: string; seller: { name: string; price: number; wh: string } | null; url: string }[]
  gapMonths?: number; now?: VaultCard[]; farm?: VaultCard[]; vault?: VaultCard[]
}
export type RelicCard = {
  r: string; vaulted: boolean; advice: { t: string; why: string; k: string }; counts: Record<"i" | "e" | "f" | "r", number>
  rewards: { n: string; rar: string; go: string; need: boolean; goal: boolean; plat: number | null; du: number }[]; evI: number; evR: number
}
export type PlanRow = {
  r: string; era: string; vaulted: boolean; count: number; plat: number; du: number
  rare: { n: string; go: string; p: number; plat: number | null } | null; need: { n: string; go: string; p: number }[]; needP: number; hardest: string
}
export type PlanData = { ref: string; squad: string; own: boolean; era: string; sort: string; q: string; total: number; owned: number; rows: PlanRow[] }
export type RelicsData = {
  tab: "mine" | "plan" | "add" | "ducats"
  plan?: PlanData
  era?: string; sort?: string; kinds?: number; tot?: number; totPl?: number; withNeed?: number; traces?: number; cards?: RelicCard[]
  q?: string; filter?: string; total?: number; list?: { r: string; vaulted: boolean; rare: string; count: number }[]
  snapshot?: string; spares?: number; plat?: number; ducats?: number; baro?: { state: string; text: string }; count?: number
  rows?: { n: string; go: string; plat: number | null; du: number; spares: number; tag: string }[]
  stock?: { item: string; go: string; ducats: number; credits: number }[]
}
export type ArsenalData = {
  tab: "top" | "mine" | "builds" | "comp" | "lich" | "arc" | "mods"
  cats?: string[]; cat?: string; own?: string; names?: string[]; cur?: string; img?: string; filteredEmpty?: boolean; tree?: string
  builds?: { value: string; label: string }[]; bi?: string
  build?: { role: string; name: string; notes: string; mods: ModSlot[]; arcanes: ModSlot[] } | null
  faction?: string; status?: string; total?: number; have?: number; mastered?: number
  factions?: { f: string; have: number; total: number }[]; how?: { f: string; who: string; how: string; vanq: string; alt: string }[]; elements?: string[]
  list?: { n: string; f: string; c: string; go: string; own: boolean; key: string; rank: number; left: number; xp: number; price: string; el: string; bonus: number }[]
  q?: string; type?: string; sort?: string; types?: string[]; count?: number; owned?: number; maxed?: number
  arcs?: { n: string; go: string; copies: number; need: number; maxRank: number; rank: number; price: string; type: string; uses: string[]; drops: string }[]
  mods?: { n: string; go: string; key: string; done: boolean; price: string; type: string; uses: number; src: string }[]
}
export type TennoData = {
  tab: string; tabs: { value: string; label: string }[]; name: string; synced: string; inGame: string; mrLabel: string; pct: number; showSign: boolean; html: string
  q?: string; total?: number; inv?: { n: string; have: number | null }[]
}
export type TFUi = {
  toast?: (text: string, action?: { label: string; fn: () => void }) => void
  openSearch?: () => void
  openMenu?: () => void
  /** Routes the shell draws itself; the old page renders nothing for them. */
  owns?: (route: string) => boolean
}

declare global {
  interface Window {
    TF?: TFApi
    TF_UI?: TFUi
  }
}

export const tf = () => window.TF as TFApi

let version = 0
let cached: TFState | null = null
function subscribe(cb: () => void) {
  const on = () => {
    version++
    cached = null
    cb()
  }
  window.addEventListener("tf:update", on)
  window.addEventListener("hashchange", on)
  return () => {
    window.removeEventListener("tf:update", on)
    window.removeEventListener("hashchange", on)
  }
}
function snapshot() {
  if (!cached) cached = tf().state()
  return cached
}

/** Live app state; re-renders whenever the app renders a page or progress changes. */
export function useTF(): TFState {
  return useSyncExternalStore(subscribe, snapshot)
}

/** True while a phone-sized layout is shown (matches the app's own 900px breakpoint). */
export function useNarrow(bp = 900) {
  const [narrow, setNarrow] = useState(() => window.innerWidth < bp)
  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${bp - 1}px)`)
    const on = () => setNarrow(m.matches)
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [bp])
  return narrow
}

export const isDark = (t: TFState["theme"]) =>
  t === "dark" || (t === "auto" && !window.matchMedia("(prefers-color-scheme: light)").matches)

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US")
export { version as _tfVersion }

/** Read derived data from the app (e.g. tf().home()); recomputed whenever the app updates. */
export function useTFData<T>(read: () => T): T {
  const [, force] = useState(0)
  useEffect(() => {
    const on = () => force((n) => n + 1)
    window.addEventListener("tf:update", on)
    window.addEventListener("hashchange", on)
    const tick = window.setInterval(on, 30000)
    return () => {
      window.removeEventListener("tf:update", on)
      window.removeEventListener("hashchange", on)
      window.clearInterval(tick)
    }
  }, [])
  return read()
}

/** Run an existing action from the app, e.g. open an item or a quest. */
export const runAct = (a: TFAction) => tf().act(a.tag, a.attrs)
export const hrefOf = (a: TFAction | null) => (a && a.attrs.href && a.attrs.href !== "#" ? a.attrs.href : "#")

export type SupportData = { ign: string; paypal: string; whisper: string }
export type FeedbackData = { hosted: boolean; ready: boolean; signed: boolean; kind: string; from: string; prefill: string; admin: boolean
  mine: { id: string; kind: string; text: string; at: string; status: string; label: string }[]; mineLoading: boolean }
export type AboutData = {
  pitch: string; site: string; wfcd: string; built: string; prices: string; sec: string
  changes: { d: string; t: string }[]
  feeds: { k: "ok" | "warn" | "bad" | "off"; t: string }[]
}
export type AdminFeedback = { id: string; kind: string; at: string; page: string; text: string; name: string; contact: string; done: boolean; status: string; signed: boolean }
export type AdminDonation = { id: string; amount: string; who: string; date: string; kind: string; note: string }
export type AdminData = {
  state: "signin" | "checking" | "denied" | "ok"; email: string; uid: string; err: string
  tab?: string; filter?: string; open?: number; fbTotal?: number
  totals?: { usdM: string; usd: string; platM: string; plat: string; n: number; who: number }
  feedback?: AdminFeedback[]; donErr?: boolean; donLoading?: boolean; donations?: AdminDonation[]
}

export type SquadMsg = {
  id: string; mine: boolean; time: string; who: string; text: string; task: string; ans: string
  kind: "text" | "invite" | "sentInvite" | "joined" | "declined" | "done" | "sys"
}
export type SquadData = {
  status: "ok" | "offline" | "loading" | "unavailable" | "signin"
  code: string; newGroup: boolean; me?: string
  requests: { id: string; name: string; code: string; from: string }[]
  blocked: { uid: string; name: string }[]
  groups: { id: string; name: string; members: number; unread: number }[]
  friends: { uid: string; name: string; pending: boolean; mr: string; xp: string; unread: number; av: string }[]
  pickable: { uid: string; name: string }[]
  tasks: { id: string; t: string }[]
  chat: null | {
    type: "friend" | "group"; id: string; name: string; code: string; pending: boolean; members: string
    addable: { uid: string; name: string }[]; log: SquadMsg[]; av?: string
  }
  compare: null | { names: string[]; rows: { label: string; vals: { v: string; top: boolean }[] }[] }
}

export type GuideKind = "quest" | "system" | "mode"
export type GuideCard = { id: string; n: string; kind: GuideKind; sum: string; time: string; steps: number; doneSteps: number; ready: boolean; done: boolean }
export type GuideDetail = GuideCard & {
  aka: string[]; was: string[]; fast: string[]; rw: string[]; w: string; questKey: string; hasTask: boolean
  unlock: { mr: number | null; mrHave: number; mrOk: boolean; quests: { n: string; done: boolean; guide: string }[]; other: string[]; ready: boolean }
  stepList: { t: string; tip: string; done: boolean }[]
  act: { label: string; route: string; tab?: string } | null
  go: { n: string; key: string }[]
  opens: { id: string; n: string; kind: GuideKind }[]
}
export type GuidesData = {
  loading?: boolean
  filter: string; q: string; total: number
  counts: Record<"all" | GuideKind, number>
  list: GuideCard[]; sel: GuideDetail | null
}

export type BuildCard = {
  id: string; src: "meta" | "player" | "mine"; item: string; img: string; kind: string; cat: string; name: string; role: string
  author: string; score: number; up: number; down: number; myVote: number; have: number; total: number; goal: boolean; at: number
}
export type BuildDetail = BuildCard & {
  notes: string; helminth: string; mine: boolean; doc: string; mods: ModSlot[]; arcanes: ModSlot[]
  itemOwned: boolean; itemGoal: boolean; canVote: boolean; authorUid: string
}
export type BuildLibData = {
  q: string; kind: string; src: string; sort: string; total: number; more: boolean; list: BuildCard[]
  shared: { loading: boolean; err: string; count: number; online: boolean }; signedIn: boolean; sel: BuildDetail | null
}
export type BuildDraft = {
  id?: string; item: string; name: string; role: string; aura: string; exilus: string; mods: string[]; arcanes: string[]; helminth: string; notes: string
}
export type MyBuildsData = {
  list: (BuildCard & { pub: string; updated: number })[]
  items: string[]; signedIn: boolean; online: boolean
  edit: (BuildDraft & { cat: string; opts: { mods: string[]; arcanes: string[]; slots: { aura: string; exilus: string; arcanes: number; helminth: boolean } } | null }) | null
}

export type WayDetail = {
  n: string; cat: string; sum: string; w: string; tips: string[]; hasTask: boolean
  ways: { t: string; how: string; why: string; req: string; tags: string[]; node: string; planet: string }[]
}
