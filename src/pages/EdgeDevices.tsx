import { useState } from 'react'
import { Badge, Drawer } from '../components/ui'
import { BUSES } from '../data/mock'
import type { Bus } from '../types'

function Bar({ value, max = 100, color = 'var(--teal)' }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="track" style={{ flex: 1 }}>
        <div
          className="fill"
          style={{
            width: `${(value / max) * 100}%`,
            background: color,
            height: '100%',
            borderRadius: 99,
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 36, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function GaugeRing({ value, max = 100, label, color }: { value: number; max?: number; label: string; color: string }) {
  const pct = (value / max) * 100
  const radius = 38
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={48} cy={48} r={radius} fill="none" stroke="#1c2638" strokeWidth={10} />
        <circle
          cx={48} cy={48} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: -4 }}>
        <strong style={{ display: 'block', fontSize: 15, color: 'var(--text)' }}>{value}{label.includes('%') ? '%' : ''}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

export function EdgeDevices() {
  const [selected, setSelected] = useState<Bus | null>(null)
  const online = BUSES.filter((b) => b.status !== 'OFFLINE')

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Edge Devices</h2>
          <p>Jetson Orin Nano edge unit status — AI inference, GPU, temperature, storage, and MQTT sync. Demo telemetry.</p>
        </div>
      </div>

      {/* bandwidth communication diagram */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h">Bandwidth-Minimized Communication Flow</div>
        <div className="card-b">
          <div className="flow">
            <div className="node" style={{ borderColor: 'var(--teal)', background: 'var(--teal-dim)' }}>
              📷 Camera Feed
              <div className="faint" style={{ fontSize: 10, marginTop: 2 }}>Raw video on-device</div>
            </div>
            <div className="arr">→</div>
            <div className="node">
              🧠 On-device AI
              <div className="faint" style={{ fontSize: 10, marginTop: 2 }}>YOLOv8n / TensorRT INT8</div>
            </div>
            <div className="arr">→</div>
            <div className="node">
              📦 Detection Metadata
              <div style={{ fontSize: 10, marginTop: 2, color: 'var(--ok)' }}>Structured JSON events</div>
            </div>
            <div className="arr">→</div>
            <div className="node">
              📡 MQTT / TLS
              <div className="faint" style={{ fontSize: 10, marginTop: 2 }}>&lt;50 KB / km target</div>
            </div>
            <div className="arr">→</div>
            <div className="node" style={{ borderColor: 'var(--teal)', background: 'var(--teal-dim)' }}>
              ☁️ Cloud
              <div className="faint" style={{ fontSize: 10, marginTop: 2 }}>Kafka + Flink</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div className="hitl" style={{ flex: 1, minWidth: 200 }}>
              <strong>Raw continuous video:</strong> NOT uploaded to cloud.
            </div>
            <div className="hitl" style={{ flex: 1, minWidth: 200 }}>
              <strong>Structured event metadata:</strong> uploaded on sync.
            </div>
            <div className="hitl" style={{ flex: 1, minWidth: 200 }}>
              <strong>Short evidence clip:</strong> uploaded for confirmed incidents only.
            </div>
          </div>
        </div>
      </div>

      {/* grid of bus edge cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
        {online.map((b) => (
          <div
            key={b.id}
            className="card"
            style={{ cursor: 'pointer', border: `1px solid ${b.status === 'WARNING' ? 'rgba(209,106,88,0.35)' : b.status === 'SYNCING' ? 'rgba(201,164,74,0.25)' : 'var(--line)'}` }}
            onClick={() => setSelected(b)}
          >
            <div className="card-h" style={{ fontSize: 12 }}>
              <span className="mono" style={{ fontWeight: 700 }}>{b.id}</span>
              <Badge tone={b.status === 'ONLINE' ? 'ok' : b.status === 'WARNING' ? 'bad' : 'warn'}>{b.status}</Badge>
            </div>
            <div className="card-b" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <GaugeRing value={b.gpuPct} label="GPU" color={b.gpuPct > 80 ? 'var(--red)' : b.gpuPct > 70 ? 'var(--amber)' : 'var(--teal)'} />
              <GaugeRing value={b.storagePct} label="Storage" color={b.storagePct > 80 ? 'var(--red)' : b.storagePct > 60 ? 'var(--amber)' : 'var(--blue)'} />
              <GaugeRing value={Math.round((b.tempC / 90) * 100)} max={100} label="Temp" color={b.tempC > 65 ? 'var(--red)' : b.tempC > 58 ? 'var(--amber)' : 'var(--teal)'} />
            </div>
            <div style={{ padding: '0 14px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div className="faint" style={{ fontSize: 11 }}>FPS <strong style={{ color: 'var(--text)' }}>{b.fps}</strong></div>
              <div className="faint" style={{ fontSize: 11 }}>Temp <strong style={{ color: b.tempC > 65 ? 'var(--red)' : 'var(--text)' }}>{b.tempC}°C</strong></div>
              <div className="faint" style={{ fontSize: 11 }}>Network <strong style={{ color: 'var(--text)' }}>{b.networkKbps} kbps</strong></div>
              <div className="faint" style={{ fontSize: 11 }}>Sync <strong style={{ color: 'var(--text)' }}>{b.lastSyncSec}s ago</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* detail drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.id} — Edge Detail` : ''}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <Badge tone={selected.status === 'ONLINE' ? 'ok' : selected.status === 'WARNING' ? 'bad' : 'warn'}>{selected.status}</Badge>
              <Badge tone="info">{selected.route}</Badge>
              <Badge tone={selected.aiOnline ? 'ok' : 'neutral'}>{selected.aiOnline ? 'AI Online' : 'AI Off'}</Badge>
            </div>

            <div className="mini-stat" style={{ marginBottom: 10 }}>
              <span>Hardware</span>
              <b>NVIDIA Jetson Orin Nano</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>TensorRT INT8 quantized inference</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'AI Inference', value: `${selected.fps} FPS` },
                { label: 'GPU Utilization', value: `${selected.gpuPct}%` },
                { label: 'Temperature', value: `${selected.tempC}°C` },
                { label: 'Storage Used', value: `${selected.storagePct}%` },
                { label: 'Network Uplink', value: `${selected.networkKbps} kbps` },
                { label: 'Last Sync', value: `${selected.lastSyncSec}s ago` },
                { label: 'Cameras Active', value: `${selected.cameraActive}/${selected.cameraTotal}` },
                { label: 'Events Today', value: `${selected.eventsToday}` },
              ].map((s) => (
                <div className="mini-stat" key={s.label}>
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Resource bars</div>
              {[
                { label: 'GPU', value: selected.gpuPct, color: selected.gpuPct > 80 ? 'var(--red)' : 'var(--teal)' },
                { label: 'Storage', value: selected.storagePct, color: selected.storagePct > 80 ? 'var(--red)' : 'var(--blue)' },
                { label: 'Temp (of 90°C)', value: Math.round((selected.tempC / 90) * 100), color: selected.tempC > 65 ? 'var(--red)' : 'var(--amber)' },
              ].map((s) => (
                <div key={s.label} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: 'var(--muted)' }}>
                    <span>{s.label}</span><span>{s.value}%</span>
                  </div>
                  <Bar value={s.value} color={s.color} />
                </div>
              ))}
            </div>

            <div className="mini-stat">
              <span>Connectivity</span>
              <b>{selected.connectivity}</b>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                MQTT over TLS · QUIC-capable · offline-first SQLite WAL buffer
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
