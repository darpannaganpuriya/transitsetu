import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, AlertTriangle, Bus, CheckCircle2, Radio, Shield } from 'lucide-react'
import { CityMap, DEFAULT_LAYERS, type MapLayers } from '../components/CityMap'
import { Badge, CountUp } from '../components/ui'
import { useApp } from '../context/AppContext'
import { BUSES, HOSPITAL_ZONES, INCIDENTS, KPIS, PEDESTRIANS, SCHOOL_ZONES, SYSTEM_HEALTH } from '../data/mock'

export function CommandCenter() {
  const app = useApp()
  const nav = useNavigate()
  const [layers, setLayers] = useState<MapLayers>(DEFAULT_LAYERS)
  const [locate, setLocate] = useState(false)

  const kpis = [
    {
      label: 'Active Buses',
      value: KPIS.activeBuses,
      suffix: '',
      icon: Bus,
      tone: 'ok' as const,
      badge: 'Online',
      help: 'Buses currently sending AI detections',
      color: 'var(--teal)',
    },
    {
      label: 'km Monitored Today',
      value: KPIS.kmMonitored,
      suffix: '',
      icon: Radio,
      tone: 'ok' as const,
      badge: 'Live',
      help: 'Road length covered by fleet cameras',
      color: 'var(--blue)',
    },
    {
      label: 'Active Detections',
      value: KPIS.activeDetections,
      suffix: '',
      icon: Activity,
      tone: 'ok' as const,
      badge: 'Edge AI',
      help: 'Events detected by on-board AI today',
      color: 'var(--teal)',
    },
    {
      label: 'Confirmed Defects',
      value: KPIS.confirmedDefects,
      suffix: '',
      icon: CheckCircle2,
      tone: 'ok' as const,
      badge: 'Corroborated',
      help: 'Defects confirmed by 2+ independent buses',
      color: 'var(--ok)',
    },
    {
      label: 'Active Incidents',
      value: KPIS.activeIncidents,
      suffix: '',
      icon: AlertTriangle,
      tone: 'bad' as const,
      badge: 'Watch',
      help: 'Hit-and-run / rash driving incidents',
      color: 'var(--red)',
    },
    {
      label: 'Fleet Confidence',
      value: KPIS.fleetConfidence,
      suffix: '%',
      icon: Shield,
      tone: 'ok' as const,
      badge: 'Bayesian',
      help: 'Overall fleet AI detection confidence',
      color: 'var(--teal)',
    },
  ]

  const focus = useMemo(
    () => (locate ? { lat: 20.2961, lng: 85.8245, zoom: 14 } : undefined),
    [locate],
  )

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Command Center</h2>
          <p>
            Live overview of the bus fleet, road conditions, active incidents, and what the AI
            has detected across Bhubaneswar's road network today.
          </p>
        </div>
        <div className="row">
          <button className="btn sm" type="button" onClick={() => nav('/worklist')}>
            Priority Action Queue
          </button>
          <button className="btn sm primary" type="button" onClick={() => nav('/consensus')}>
            Fleet Consensus Engine
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">
              <span>{k.label}</span>
              <span className="kpi-ico" style={{ background: `${k.color}18`, color: k.color }}>
                <k.icon size={14} />
              </span>
            </div>
            <strong style={{ color: k.tone === 'bad' ? 'var(--red)' : 'var(--text)' }}>
              <CountUp value={k.value} decimals={k.suffix === '%' ? 1 : 0} />
              {k.suffix}
            </strong>
            <div className="kpi .sub">
              <Badge tone={k.tone}>{k.badge}</Badge>
            </div>
            <div className="faint" style={{ fontSize: 11, marginTop: 5, lineHeight: 1.4 }}>
              {k.help}
            </div>
          </div>
        ))}
      </div>

      {/* Map + Feed */}
      <div className="grid-cc">
        {/* Map */}
        <div style={{ position: 'relative' }}>
          <div className="layer-panel">
            <div className="faint" style={{ fontSize: 10, letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>
              MAP LAYERS
            </div>
            {(
              [
                ['buses',          'Bus positions'],
                ['infrastructure', 'Road defects'],
                ['pending',        'Pending (unconfirmed)'],
                ['incidents',      'Incident markers'],
                ['traffic',        'Traffic congestion'],
                ['context',        'School / hospital zones'],
                ['heatmap',        'Severity heatmap'],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => setLayers((l) => ({ ...l, [key]: !l[key] }))}
                />
                {label}
              </label>
            ))}
            <button
              className="btn sm"
              style={{ marginTop: 8, width: '100%', fontSize: 11 }}
              type="button"
              onClick={() => setLocate((v) => !v)}
            >
              📍 {locate ? 'Reset view' : 'Zoom to HQ'}
            </button>
          </div>

          <CityMap
            buses={BUSES}
            defects={app.defects}
            incidents={INCIDENTS}
            pedestrians={PEDESTRIANS}
            layers={layers}
            focus={focus}
          />

          <div className="map-legend">
            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)' }}>LEGEND</div>
            <div><span className="chip ok" style={{ padding: '1px 6px' }}>●</span> Confirmed defect</div>
            <div><span className="chip warn" style={{ padding: '1px 6px' }}>●</span> Pending — awaiting 2nd bus</div>
            <div><span className="chip bad" style={{ padding: '1px 6px' }}>●</span> Incident (hit-and-run / rash driving)</div>
            <div><span className="chip info" style={{ padding: '1px 6px' }}>●</span> Vulnerable pedestrian event</div>
            <div><span className="chip ok" style={{ padding: '1px 6px' }}>◆</span> Active bus</div>
            <div className="faint">
              School zones: {SCHOOL_ZONES.length} · Hospital zones: {HOSPITAL_ZONES.length}
            </div>
          </div>
        </div>

        {/* Live feed */}
        <div className="card feed">
          <div className="card-h">
            <span>
              <span className="live-dot" />
              Live AI Detection Feed
            </span>
            <Badge tone="ok">Edge metadata</Badge>
          </div>
          <div style={{ padding: '8px 14px', background: 'var(--surface-2)', borderBottom: '1px solid var(--line)', fontSize: 11, color: 'var(--muted)' }}>
            Events detected by buses in real-time. Only structured metadata is uploaded — no raw video.
          </div>
          <div className="feed-list">
            {app.feed.map((f) => (
              <div className="feed-item" key={f.id}>
                <h4>{f.title}</h4>
                <div className="meta">
                  <span>{f.meta}</span>
                  <span>{f.time}</span>
                </div>
                <div className="muted" style={{ fontSize: 12 }}>{f.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System health */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
          System Health — Demo Telemetry
        </div>
        <div className="grid-3">
          {SYSTEM_HEALTH.map((s) => (
            <div className="mini-stat" key={s.name}>
              <span>{s.name}</span>
              <b><Badge tone="ok">{s.status}</Badge></b>
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
