import { useMemo, useState } from 'react'
import { Badge, Drawer, HumanInLoop, ImpactBars, severityTone } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { DefectStatus, DefectType, Severity } from '../types'

const types: DefectType[] = [
  'Pothole',
  'Damaged Road',
  'Missing Divider',
  'Missing Zebra Crossing',
  'Damaged Signboard',
  'Waterlogging',
]

export function RoadIntelligence() {
  const app = useApp()
  const [type, setType] = useState<DefectType | 'ALL'>('ALL')
  const [sev, setSev] = useState<Severity | 'ALL'>('ALL')
  const [st, setSt] = useState<DefectStatus | 'ALL'>('ALL')
  const [buses, setBuses] = useState(0)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'impact' | 'confidence'>('impact')
  const [open, setOpen] = useState<string | null>(null)

  const rows = useMemo(() => {
    return app.defects
      .filter((d) => type === 'ALL' || d.type === type)
      .filter((d) => sev === 'ALL' || d.severity === sev)
      .filter((d) => st === 'ALL' || d.status === st)
      .filter((d) => d.buses.length >= buses)
      .filter((d) => `${d.location} ${d.segment} ${d.id}`.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (sort === 'impact' ? b.impact - a.impact : b.confidence - a.confidence))
  }, [app.defects, buses, q, sev, sort, st, type])

  const selected = app.defects.find((d) => d.id === open)

  const cats = types.map((t) => {
    const all = app.defects.filter((d) => d.type === t)
    return {
      t,
      total: all.length,
      confirmed: all.filter((d) => d.status === 'Confirmed').length,
      pending: all.filter((d) => d.status === 'Pending Corroboration').length,
    }
  })

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Road Intelligence</h2>
          <p>Geo-tagged, severity-scored defects. Confirmed only after Fleet Consensus Engine corroboration.</p>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom: 12 }}>
        {cats.map((c) => (
          <button key={c.t} className="mini-stat" type="button" onClick={() => setType(c.t)} style={{ textAlign: 'left' }}>
            <span>{c.t}</span>
            <b>{c.total}</b>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Confirmed {c.confirmed} · Pending {c.pending}
            </div>
          </button>
        ))}
      </div>
      <div className="filters">
        <select className="select" value={type} onChange={(e) => setType(e.target.value as DefectType | 'ALL')}>
          <option value="ALL">Defect type</option>
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className="select" value={sev} onChange={(e) => setSev(e.target.value as Severity | 'ALL')}>
          <option value="ALL">Severity</option>
          <option value="critical">critical</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select className="select" value={st} onChange={(e) => setSt(e.target.value as DefectStatus | 'ALL')}>
          <option value="ALL">Confirmed / Pending</option>
          <option>Pending Corroboration</option>
          <option>Confirmed</option>
          <option>Resolved</option>
        </select>
        <select className="select" value={buses} onChange={(e) => setBuses(Number(e.target.value))}>
          <option value={0}>Corroborating buses</option>
          <option value={1}>≥ 1</option>
          <option value={2}>≥ 2</option>
          <option value={3}>≥ 3</option>
        </select>
        <input placeholder="Road segment / location" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as 'impact' | 'confidence')}>
          <option value="impact">Sort: Urban Impact Score</option>
          <option value="confidence">Sort: confidence</option>
        </select>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Conf.</th>
                <th>Buses</th>
                <th>First detected</th>
                <th>Last confirmed</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={open === d.id ? 'selected' : ''} onClick={() => setOpen(d.id)} style={{ cursor: 'pointer' }}>
                  <td className="mono">{d.id}</td>
                  <td>{d.type}</td>
                  <td>
                    {d.location}
                    <div className="faint">{d.segment}</div>
                  </td>
                  <td>
                    <Badge tone={severityTone(d.severity)}>{d.severity}</Badge>
                  </td>
                  <td>
                    <Badge tone={d.status === 'Confirmed' ? 'ok' : 'warn'}>{d.status}</Badge>
                  </td>
                  <td>{d.confidence}%</td>
                  <td>{d.buses.length}</td>
                  <td className="mono">{d.firstDetected}</td>
                  <td className="mono">{d.lastConfirmed}</td>
                  <td>{d.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Drawer open={!!selected} onClose={() => setOpen(null)} title="Urban Impact Score">
        {selected && (
          <div>
            <p>
              {selected.type} · {selected.location}
            </p>
            <p className="muted">{selected.note}</p>
            <p className="faint" style={{ fontSize: 12, margin: '12px 0' }}>
              Formula: Severity × Traffic Volume × Proximity to Schools/Hospitals
            </p>
            <ImpactBars {...selected.factors} />
            <h3 style={{ marginTop: 18 }}>
              {selected.impact >= 80 ? 'HIGH PRIORITY' : 'REVIEW'}
            </h3>
            <p className="muted">Near school zone + high traffic volume</p>
            <div className="row" style={{ marginTop: 14 }}>
              <button className="btn primary sm" type="button" onClick={() => app.setWorkStatus('WL-091', 'Dispatched')}>
                Dispatch
              </button>
              <button className="btn sm" type="button" onClick={() => app.setWorkStatus('WL-091', 'Acknowledged')}>
                Acknowledge
              </button>
              <button className="btn sm" type="button" onClick={() => app.setWorkStatus('WL-091', 'Assigned')}>
                Assign
              </button>
              <button className="btn sm" type="button" onClick={() => app.pushToast('Opening Evidence Center')}>
                View Evidence
              </button>
              <button className="btn sm" type="button" onClick={() => app.setWorkStatus('WL-091', 'Closed')}>
                Mark Resolved
              </button>
            </div>
            <div style={{ marginTop: 16 }}>
              <HumanInLoop />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
