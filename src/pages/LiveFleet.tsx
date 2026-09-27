import { useMemo, useState } from 'react'
import { CityMap, DEFAULT_LAYERS } from '../components/CityMap'
import { Badge, Drawer } from '../components/ui'
import { BUSES, INCIDENTS, PEDESTRIANS } from '../data/mock'
import { useApp } from '../context/AppContext'
import type { Bus, BusStatus } from '../types'

export function LiveFleet() {
  const app = useApp()
  const [selected, setSelected] = useState<Bus | null>(null)
  const [status, setStatus] = useState<BusStatus | 'ALL'>('ALL')
  const rows = useMemo(
    () => BUSES.filter((b) => status === 'ALL' || b.status === status),
    [status],
  )
  const layers = { ...DEFAULT_LAYERS, infrastructure: false, incidents: false, heatmap: false, pending: false }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Live Fleet</h2>
          <p>Every bus is a moving sensor node. Edge AI status, cameras, connectivity, and last MQTT sync.</p>
        </div>
      </div>
      <div className="filters">
        {(['ALL', 'ONLINE', 'SYNCING', 'WARNING', 'OFFLINE'] as const).map((s) => (
          <button key={s} className={`btn sm ${status === s ? 'primary' : ''}`} type="button" onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>
      <CityMap buses={rows} defects={app.defects} incidents={INCIDENTS} pedestrians={PEDESTRIANS} layers={layers} height={380} />
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>GPS</th>
                <th>Camera</th>
                <th>AI</th>
                <th>Connectivity</th>
                <th>Last sync</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} onClick={() => setSelected(b)} style={{ cursor: 'pointer' }}>
                  <td className="mono">{b.id}</td>
                  <td>{b.route}</td>
                  <td>
                    <Badge tone={b.status === 'ONLINE' ? 'ok' : b.status === 'OFFLINE' ? 'neutral' : 'warn'}>{b.status}</Badge>
                  </td>
                  <td className="mono">
                    {b.position.lat.toFixed(4)}, {b.position.lng.toFixed(4)}
                  </td>
                  <td>
                    {b.cameraActive}/{b.cameraTotal}
                  </td>
                  <td>{b.aiOnline ? 'Online' : 'Off'}</td>
                  <td>{b.connectivity}</td>
                  <td>{b.lastSyncSec < 60 ? `${b.lastSyncSec} sec ago` : `${Math.round(b.lastSyncSec / 60)} min ago`}</td>
                  <td>{b.eventsToday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.id ?? ''}>
        {selected && (
          <div>
            <p className="muted">{selected.route}</p>
            <div className="stat-grid" style={{ margin: '14px 0' }}>
              <div className="mini-stat">
                <span>AI</span>
                <b>{selected.aiOnline ? 'Online' : 'Off'}</b>
              </div>
              <div className="mini-stat">
                <span>Camera</span>
                <b>
                  {selected.cameraActive}/{selected.cameraTotal} Active
                </b>
              </div>
              <div className="mini-stat">
                <span>Connectivity</span>
                <b>{selected.connectivity}</b>
              </div>
              <div className="mini-stat">
                <span>Storage</span>
                <b>{selected.storagePct}%</b>
              </div>
            </div>
            <div className="mini-stat">
              <span>Last Sync</span>
              <b>{selected.lastSyncSec} sec ago</b>
            </div>
            <div className="mini-stat" style={{ marginTop: 8 }}>
              <span>Events Today</span>
              <b>{selected.eventsToday}</b>
            </div>
            <p className="faint" style={{ marginTop: 16, fontSize: 12 }}>
              Jetson Orin Nano · TensorRT INT8 · Bandwidth-Minimized MQTT/TLS uplink.
            </p>
          </div>
        )}
      </Drawer>
    </div>
  )
}
