import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, severityTone } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { Severity } from '../types'

export function Alerts() {
  const app = useApp()
  const nav = useNavigate()
  const [sev, setSev] = useState<Severity | 'ALL'>('ALL')
  const rows = useMemo(
    () => app.alerts.filter((a) => sev === 'ALL' || a.severity === sev),
    [app.alerts, sev],
  )

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Alerts</h2>
          <p>Critical incidents, high-impact defects, fleet offline, congestion, pending corroboration.</p>
        </div>
      </div>
      <div className="filters">
        {(['ALL', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
          <button key={s} className={`btn sm ${sev === s ? 'primary' : ''}`} type="button" onClick={() => setSev(s)}>
            {s}
          </button>
        ))}
      </div>
      <div className="card">
        {rows.map((a) => (
          <div key={a.id} className="feed-item" style={{ opacity: a.read ? 0.7 : 1 }}>
            <div className="meta">
              <span>
                <Badge tone={severityTone(a.severity)}>{a.severity}</Badge> {a.title}
              </span>
              <span>{a.time}</span>
            </div>
            <div className="muted">{a.body}</div>
            <div className="row" style={{ marginTop: 8 }}>
              {!a.read && (
                <button className="btn sm" type="button" onClick={() => app.markAlertRead(a.id)}>
                  Mark as read
                </button>
              )}
              <button className="btn sm" type="button" onClick={() => app.acknowledgeAlert(a.id)}>
                Acknowledge
              </button>
              <button className="btn sm primary" type="button" onClick={() => nav(a.href)}>
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
