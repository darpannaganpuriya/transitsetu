import { useEffect, useState, type ReactNode } from 'react'
import type { Severity } from '../types'

export function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(' ')
}

export function Badge({
  tone = 'neutral',
  children,
}: {
  tone?: 'ok' | 'warn' | 'bad' | 'info' | 'neutral'
  children: ReactNode
}) {
  return <span className={classNames('chip', tone)}>{children}</span>
}

export function severityTone(s: Severity) {
  if (s === 'critical' || s === 'high') return 'bad' as const
  if (s === 'medium') return 'warn' as const
  return 'info' as const
}

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const from = 0
    const dur = 900
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - (1 - p) ** 3
      setN(from + (value - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-IN')}</>
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="modal-bg" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="card-h">
          <span>{title}</span>
          <button className="btn sm ghost" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="card-b">{children}</div>
      </div>
    </div>
  )
}

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="drawer-bg" onClick={onClose} role="presentation">
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="page-head" style={{ marginBottom: 12 }}>
          <div>
            <h2>{title}</h2>
          </div>
          <button className="btn sm" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </aside>
    </div>
  )
}

export function ImpactBars({
  severity,
  traffic,
  proximity,
}: {
  severity: number
  traffic: number
  proximity: number
}) {
  return (
    <div className="bars">
      <div className="bar-row">
        <span>Severity</span>
        <div className="track">
          <div className="fill red" style={{ width: `${severity}%` }} />
        </div>
        <span>{severity}</span>
      </div>
      <div className="bar-row">
        <span>Traffic Volume</span>
        <div className="track">
          <div className="fill amber" style={{ width: `${traffic}%` }} />
        </div>
        <span>{traffic}</span>
      </div>
      <div className="bar-row">
        <span>Sensitive Location Proximity</span>
        <div className="track">
          <div className="fill" style={{ width: `${proximity}%` }} />
        </div>
        <span>{proximity}</span>
      </div>
    </div>
  )
}

export function HumanInLoop() {
  return (
    <div className="hitl">
      <strong>Human-in-the-loop.</strong> TransitSetu assists authorities with evidence and
      prioritization. Final operational decisions remain with authorized personnel.
    </div>
  )
}
