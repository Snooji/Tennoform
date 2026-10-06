export function PageHead({ eyebrow, title, lede }: { eyebrow?: string; title: string; lede?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-1">
      {eyebrow ? <span className="text-xs text-muted-foreground">{eyebrow}</span> : null}
      <h1 className="font-heading text-3xl font-semibold">{title}</h1>
      {lede ? <p className="max-w-2xl text-sm text-muted-foreground">{lede}</p> : null}
    </header>
  )
}

export const linkCls = "underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
