import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '../components/ui'
import { BUSES, SYSTEM_HEALTH } from '../data/mock'

const TOOLTIP_STYLE = { background: '#151e2e', border: '1px solid #2a3548', fontSize: 12 }

const fpsHistory = [
  { t: '06:00', fps: 27 }, { t: '08:00', fps: 28 }, { t: '10:00', fps: 26 },
  { t: '12:00', fps: 29 }, { t: '14:00', fps: 28 }, { t: '16:00', fps: 28 }, { t: '18:00', fps: 27 },
]
const syncHistory = [
  { t: '06:00', synced: 16 }, { t: '08:00', synced: 18 }, { t: '10:00', synced: 18 },
  { t: '12:00', synced: 17 }, { t: '14:00', synced: 18 }, { t: '16:00', synced: 18 }, { t: '18:00', synced: 18 },
]

function statusTone(s: string) {
  if (s === 'ONLINE') return 'ok' as const
  if (s === 'OFFLINE') return 'neutral' as const
  if (s === 'WARNING') return 'bad' as const
  return 'warn' as const
}

export function FleetAnalytics() {
  const online = BUSES.filter((b) => b.status === 'ONLINE').length
  const syncing = BUSES.filter((b) => b.status === 'SYNCING').length
  const warning = BUSES.filter((b) => b.status === 'WARNING').length
  const offline = BUSES.filter((b) => b.status === 'OFFLINE').length
  const avgFps = Math.round(BUSES.filter((b) => b.fps > 0).reduce((s, b) => s + b.fps, 0) / online)
  const avgGpu = Math.round(BUSES.filter((b) => b.gpuPct > 0).reduce((s, b) => s + b.gpuPct, 0) / online)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Fleet Analytics</h2>
          <p>Edge device health, AI inference metrics, connectivity, and synchronization telemetry. Demo data.</p>
        </div>
      </div>

      {/* summary pills */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(6,1fr)', marginBottom: 14 }}>
        {[
          { label: 'Online', value: online, tone: 'ok' },
          { label: 'Syncing', value: syncing, tone: 'warn' },
          { label: 'Warning', value: warning, tone: 'bad' },
          { label: 'Offline', value: offline, tone: 'neutral' },
          { label: 'Avg FPS', value: avgFps, tone: 'ok' },
          { label: 'Avg GPU', value: avgGpu, suffix: '%', tone: avgGpu > 75 ? 'bad' : 'ok' },
        ].map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">{k.label}</div>
            <strong>{k.value}{k.suffix ?? ''}</strong>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="card">
          <div className="card-h">Fleet-avg FPS trend (demo)</div>
          <div className="card-b" style={{ height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={fpsHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} domain={[0, 35]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="fps" stroke="#3aa88f" fill="#3aa88f" fillOpacity={0.2} name="Avg FPS" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-h">Buses synchronized (per hour)</div>
          <div className="card-b" style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={syncHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} domain={[0, 20]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="synced" fill="#5b8fd4" radius={[3, 3, 0, 0]} name="Synced buses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System health */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h">System Health</div>
        <div className="grid-3" style={{ padding: 14, gap: 10 }}>
          {SYSTEM_HEALTH.map((s) => (
            <div className="mini-stat" key={s.name}>
              <span>{s.name}</span>
              <b><Badge tone="ok">{s.status}</Badge></b>
              <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>{s.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* per-bus telemetry */}
      <div className="card">
        <div className="card-h">Per-Bus Edge Telemetry (demo snapshot)</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bus</th>
                <th>Route</th>
                <th>Status</th>
                <th>FPS</th>
                <th>GPU</th>
                <th>Temp</th>
                <th>Storage</th>
                <th>Net kbps</th>
                <th>Last sync</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {BUSES.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.route}</td>
                  <td><Badge tone={statusTone(b.status)}>{b.status}</Badge></td>
                  <td>{b.fps}</td>
                  <td>
                    <span style={{ color: b.gpuPct > 80 ? 'var(--red)' : b.gpuPct > 70 ? 'var(--amber)' : 'var(--ok)' }}>
                      {b.gpuPct}%
                    </span>
                  </td>
                  <td>
                    <span style={{ color: b.tempC > 65 ? 'var(--red)' : b.tempC > 58 ? 'var(--amber)' : 'var(--text)' }}>
                      {b.tempC}°C
                    </span>
                  </td>
                  <td>
                    <span style={{ color: b.storagePct > 80 ? 'var(--red)' : b.storagePct > 60 ? 'var(--amber)' : 'var(--text)' }}>
                      {b.storagePct}%
                    </span>
                  </td>
                  <td>{b.networkKbps}</td>
                  <td className="mono">
                    {b.lastSyncSec < 60 ? `${b.lastSyncSec}s` : `${Math.round(b.lastSyncSec / 60)}m`}
                  </td>
                  <td>{b.eventsToday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
