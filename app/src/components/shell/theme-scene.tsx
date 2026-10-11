import { useEffect, useMemo } from "react"

import { useTF } from "@/lib/tf"

/* The living backdrop behind every page in a faction style. Original artwork drawn in SVG and CSS (no game art).
   Only transform and opacity animate, it pauses while the tab is hidden, and reduced motion stops it (see index.css). */

const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
type P = { x: number; y: number; s: number; d: number; delay: number; drift: number }
function particles(n: number, seed: number, size: [number, number], dur: [number, number]): P[] {
  const r = rng(seed)
  return Array.from({ length: n }, () => ({
    x: r() * 100, y: r() * 100, s: size[0] + r() * (size[1] - size[0]),
    d: dur[0] + r() * (dur[1] - dur[0]), delay: -r() * dur[1], drift: (r() - 0.5) * 60,
  }))
}
const pstyle = (p: P) => ({ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s`, "--drift": `${p.drift}px` }) as React.CSSProperties

/** A gear outline: n teeth on a ring, drawn as one path. */
function gearPath(r: number, n: number, depth: number) {
  const pts: string[] = []
  for (let i = 0; i < n * 4; i++) {
    const a = (i / (n * 4)) * Math.PI * 2
    const rr = i % 4 < 2 ? r : r - depth
    pts.push(`${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`)
  }
  return "M" + pts.join("L") + "Z"
}

function Grineer() {
  const embers = useMemo(() => particles(16, 21, [2, 4], [9, 16]), [])
  return (
    <>
      <div className="sc-g-beacon" />
      <div className="sc-g-smoke" />
      {embers.map((p, i) => <span key={i} className="sc-g-ember" style={pstyle(p)} />)}
    </>
  )
}

function Corpus() {
  const r = rng(5)
  const traces = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const y = 60 + i * 90 + r() * 40, j = (r() > 0.5 ? 1 : -1) * (20 + r() * 30), x1 = 120 + r() * 300
    return `M-20 ${y.toFixed(0)}H${x1.toFixed(0)}l${Math.abs(j).toFixed(0)} ${j.toFixed(0)}H${(x1 + 260 + r() * 300).toFixed(0)}l${Math.abs(j).toFixed(0)} ${(-j).toFixed(0)}H1020`
  }), []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <svg className="sc-c-traces" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {traces.map((d, i) => <g key={i}><path d={d} className="sc-c-trace" /><path d={d} className="sc-c-pulse" style={{ animationDelay: `${-i * 1.7}s`, animationDuration: `${7 + i}s` }} /></g>)}
      </svg>
      <div className="sc-c-scan" />
      <div className="sc-c-haze" />
    </>
  )
}

function Entrati() {
  return (
    <>
      <svg className="sc-e-gear sc-e-gear-a" viewBox="-130 -130 260 260" aria-hidden>
        <path d={gearPath(118, 24, 12)} /><circle r="84" /><circle r="78" /><circle r="16" />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1="0" y1="0" x2={(Math.cos(i * Math.PI / 3) * 78).toFixed(1)} y2={(Math.sin(i * Math.PI / 3) * 78).toFixed(1)} />)}
      </svg>
      <svg className="sc-e-gear sc-e-gear-b" viewBox="-80 -80 160 160" aria-hidden>
        <path d={gearPath(72, 14, 10)} /><circle r="48" /><circle r="10" />
      </svg>
      <svg className="sc-e-orrery" viewBox="-160 -160 320 320" aria-hidden>
        <circle r="150" /><circle r="118" /><circle r="84" /><circle r="56" />
        <g className="sc-e-orbit sc-e-o1"><circle cx="150" r="6" /></g>
        <g className="sc-e-orbit sc-e-o2"><circle cx="-118" r="4.5" /></g>
        <g className="sc-e-orbit sc-e-o3"><circle cy="84" r="5" /></g>
      </svg>
      <div className="sc-e-glow" />
    </>
  )
}

function Lotus() {
  const motes = useMemo(() => particles(22, 9, [2, 5], [14, 26]), [])
  return (
    <>
      <div className="sc-l-vapor sc-l-v1" /><div className="sc-l-vapor sc-l-v2" /><div className="sc-l-vapor sc-l-v3" />
      <svg className="sc-l-rings" viewBox="-200 -200 400 400" aria-hidden>
        <circle r="190" /><circle r="172" /><circle r="128" /><circle r="122" /><circle r="80" />
        <g className="sc-l-spin"><circle cx="172" r="3" /><circle cx="-172" r="2" /><circle cy="128" r="2.5" /></g>
        {Array.from({ length: 7 }, (_, i) => <path key={i} className="sc-l-petal" transform={`rotate(${i * (360 / 7)})`} d="M0 -40C10 -56 10 -72 0 -78C-10 -72 -10 -56 0 -40Z" />)}
      </svg>
      {motes.map((p, i) => <span key={i} className="sc-l-mote" style={pstyle(p)} />)}
    </>
  )
}

function Infested() {
  const spores = useMemo(() => particles(26, 17, [2, 5], [12, 22]), [])
  const veins = useMemo(() => {
    const r = rng(31)
    const out: { d: string; w: number; len: number }[] = []
    const grow = (x: number, y: number, a: number, w: number, depth: number) => {
      if (!depth || w < 0.8) return
      const l = (40 + r() * 60) * (w / 6 + 0.5)
      const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l
      const cx = (x + x2) / 2 + (r() - 0.5) * 30, cy = (y + y2) / 2 + (r() - 0.5) * 30
      out.push({ d: `M${x.toFixed(0)} ${y.toFixed(0)}Q${cx.toFixed(0)} ${cy.toFixed(0)} ${x2.toFixed(0)} ${y2.toFixed(0)}`, w, len: l * 1.2 })
      grow(x2, y2, a + (r() - 0.5) * 0.5, w * 0.72, depth - 1)
      if (r() < 0.8) grow(x2, y2, a + (r() > 0.5 ? 1 : -1) * (0.45 + r() * 0.25), w * 0.55, depth - 1)
    }
    grow(-10, 520, -0.35, 7, 7); grow(1010, 80, Math.PI - 0.4, 6, 7); grow(420, 630, -1.5, 5, 6); grow(-10, 120, 0.25, 4.5, 6)
    return out
  }, [])
  return (
    <>
      <div className="sc-i-cyst sc-i-c1" /><div className="sc-i-cyst sc-i-c2" /><div className="sc-i-cyst sc-i-c3" />
      <svg className="sc-i-veins" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {veins.map((v, i) => (
          <path key={i} d={v.d} strokeWidth={v.w} className="sc-i-vein" style={{ strokeDasharray: v.len, strokeDashoffset: v.len, animationDelay: `${(i % 9) * 0.18}s` }} />
        ))}
        {veins.filter((_, i) => i % 3 === 0).map((v, i) => <path key={"p" + i} d={v.d} strokeWidth={Math.max(1, v.w * 0.6)} className="sc-i-flow" style={{ animationDelay: `${-i * 0.9}s` }} />)}
      </svg>
      {spores.map((p, i) => <span key={i} className="sc-i-spore" style={pstyle(p)} />)}
    </>
  )
}

/* ---------- Default: an Orbiter navigation console. A star chart, orbits with travelling nodes, a radar sweep, comets ---------- */
function Orbiter() {
  const stars = useMemo(() => particles(18, 41, [2, 3.5], [3, 7]), [])
  const comets = useMemo(() => particles(6, 77, [1, 1], [9, 16]), [])
  return (
    <>
      <div className="sc-d-chart" />
      {stars.map((p, i) => <span key={i} className="sc-d-twinkle" style={pstyle(p)} />)}
      <div className="sc-d-sweep" />
      <svg className="sc-d-orbits" viewBox="-300 -300 600 600" aria-hidden>
        <circle r="290" className="sc-d-ring sc-d-dash" /><circle r="230" className="sc-d-ring" /><circle r="160" className="sc-d-ring sc-d-dash" /><circle r="90" className="sc-d-ring" />
        {Array.from({ length: 72 }, (_, i) => { const a = (i / 72) * Math.PI * 2, r1 = i % 6 ? 284 : 276; return <line key={i} className="sc-d-tick" x1={(Math.cos(a) * r1).toFixed(1)} y1={(Math.sin(a) * r1).toFixed(1)} x2={(Math.cos(a) * 290).toFixed(1)} y2={(Math.sin(a) * 290).toFixed(1)} /> })}
        <g className="sc-d-orbit sc-d-o1"><circle cx="230" r="7" className="sc-d-node" /><circle cx="230" r="16" className="sc-d-halo" /></g>
        <g className="sc-d-orbit sc-d-o2"><circle cx="-160" r="5" className="sc-d-node" /></g>
        <g className="sc-d-orbit sc-d-o3"><circle cy="90" r="4" className="sc-d-node" /></g>
        <circle r="14" className="sc-d-core" />
      </svg>
      {comets.map((p, i) => <span key={"c" + i} className="sc-d-comet" style={{ left: `${p.x}%`, top: `${p.y * 0.5}%`, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }} />)}
    </>
  )
}

/* ---------- Foundry: a living blueprint. A fabrication laser, grid cells lighting as it passes, schematics drafting themselves ---------- */
function Blueprint() {
  const r = rng(12)
  const cells = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ x: Math.floor(r() * 60), y: Math.floor(r() * 40), d: (i * 0.57) % 9 })), []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {cells.map((c, i) => <span key={i} className="sc-f-cell" style={{ left: c.x * 24, top: c.y * 24, animationDelay: `${c.d}s` }} />)}
      <svg className="sc-f-schem sc-f-s1" viewBox="-160 -160 320 320" aria-hidden>
        <path className="sc-f-draw" pathLength={100} d={gearPath(120, 18, 14)} />
        <circle className="sc-f-draw" pathLength={100} r="78" /><circle className="sc-f-draw" pathLength={100} r="30" /><circle className="sc-f-draw" pathLength={100} r="12" />
        {Array.from({ length: 6 }, (_, i) => { const a = (i * Math.PI) / 3; return <path key={i} className="sc-f-draw" pathLength={100} d={`M${(Math.cos(a) * 32).toFixed(1)} ${(Math.sin(a) * 32).toFixed(1)}L${(Math.cos(a) * 76).toFixed(1)} ${(Math.sin(a) * 76).toFixed(1)}`} /> })}
        <path className="sc-f-dim" d="M-120 140H120M-120 132V148M120 132V148M-112 134L-120 140L-112 146M112 134L120 140L112 146" />
        <text className="sc-f-label" x="0" y="156" textAnchor="middle">Ø 240</text>
        <path className="sc-f-dim" d="M0 0L95 -95M95 -95H140" /><text className="sc-f-label" x="142" y="-99">R78</text>
      </svg>
      <svg className="sc-f-schem sc-f-s2" viewBox="0 0 360 160" aria-hidden>
        <path className="sc-f-draw" pathLength={100} d="M10 60H70L90 40H250L270 60H340V100H270L250 120H90L70 100H10Z" />
        <path className="sc-f-draw" pathLength={100} d="M90 40V120M250 40V120M120 60H220V100H120Z" />
        <circle className="sc-f-draw" pathLength={100} cx="40" cy="80" r="10" /><circle className="sc-f-draw" pathLength={100} cx="305" cy="80" r="10" />
        <path className="sc-f-dim" d="M10 140H340M10 132V148M340 132V148" /><text className="sc-f-label" x="175" y="156" textAnchor="middle">330.0</text>
        <path className="sc-f-dim" d="M352 60V100M346 60H358M346 100H358" /><text className="sc-f-label" x="356" y="54" textAnchor="end">40</text>
      </svg>
      <div className="sc-f-laser" />
    </>
  )
}

/* ---------- Prime: an Orokin cathedral. God rays breathing from above, a halo sigil turning, rings pulsing out, golden dust ---------- */
function Cathedral() {
  const dust = useMemo(() => particles(26, 53, [2, 4], [14, 26]), [])
  return (
    <>
      <svg className="sc-p-rays" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMin slice" aria-hidden>
        <defs>
          <filter id="sc-p-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18" /></filter>
          <linearGradient id="sc-p-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopOpacity=".55" /><stop offset="1" stopOpacity="0" /></linearGradient>
        </defs>
        <g filter="url(#sc-p-blur)" fill="url(#sc-p-ray)">
          {[[-26, 70], [-14, 50], [-4, 90], [8, 60], [19, 80], [30, 46]].map(([a, w], i) => (
            <path key={i} transform={`rotate(${a} 500 -60)`} d={`M${500 - w / 6} -60L${500 + w / 6} -60L${500 + w} 760L${500 - w} 760Z`} />
          ))}
        </g>
      </svg>
      <svg className="sc-p-halo" viewBox="-200 -200 400 400" aria-hidden>
        <g className="sc-p-outer">
          <circle r="190" /><circle r="182" />
          {Array.from({ length: 48 }, (_, i) => { const a = (i / 48) * Math.PI * 2, r1 = i % 4 ? 176 : 166; return <line key={i} x1={(Math.cos(a) * r1).toFixed(1)} y1={(Math.sin(a) * r1).toFixed(1)} x2={(Math.cos(a) * 182).toFixed(1)} y2={(Math.sin(a) * 182).toFixed(1)} /> })}
          {Array.from({ length: 8 }, (_, i) => <path key={i} transform={`rotate(${i * 45})`} d="M0 -150L9 -136L0 -122L-9 -136Z" />)}
        </g>
        <g className="sc-p-inner">
          <circle r="112" /><path d="M0 -104L24 -24L104 0L24 24L0 104L-24 24L-104 0L-24 -24Z" /><path d="M0 -70L50 -50L70 0L50 50L0 70L-50 50L-70 0L-50 -50Z" /><circle r="22" />
        </g>
        {[0, 1, 2].map((i) => <circle key={i} r="60" className="sc-p-pulse" style={{ animationDelay: `${i * 2.7}s` }} />)}
      </svg>
      {dust.map((p, i) => <span key={i} className="sc-p-dust" style={pstyle(p)} />)}
    </>
  )
}

const SCENES: Record<string, () => React.ReactElement> = { default: Orbiter, foundry: Blueprint, prime: Cathedral, grineer: Grineer, corpus: Corpus, entrati: Entrati, lotus: Lotus, infested: Infested }

export function ThemeScene() {
  const { style } = useTF()
  // everything stops while the tab is hidden, so the backdrop never costs battery in the background
  useEffect(() => {
    const on = () => document.documentElement.classList.toggle("tf-hidden", document.hidden)
    on()
    document.addEventListener("visibilitychange", on)
    return () => document.removeEventListener("visibilitychange", on)
  }, [])
  const Scene = SCENES[style]
  if (!Scene) return null
  return <div className={`tf-scene tf-scene-${style}`} aria-hidden><Scene /></div>
}
