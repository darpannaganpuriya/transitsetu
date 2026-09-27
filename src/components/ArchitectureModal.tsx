import { Modal } from './ui'
import { useApp } from '../context/AppContext'

const nodes = [
  { k: 'CAPTURE', v: 'Bus cameras' },
  { k: 'EDGE AI', v: 'YOLOv8n' },
  { k: 'TRACK', v: 'ByteTrack' },
  { k: 'BUFFER', v: 'SQLite WAL' },
  { k: 'UPLINK', v: 'MQTT/TLS' },
  { k: 'STREAM', v: 'Kafka + Flink' },
  { k: 'CONSENSUS', v: 'DBSCAN + Bayesian fusion' },
  { k: 'GEO / TS', v: 'PostGIS + TimescaleDB' },
  { k: 'COMMAND', v: 'React + Mapbox GL' },
]

export function ArchitectureModal() {
  const { architectureOpen, setArchitectureOpen } = useApp()
  return (
    <Modal open={architectureOpen} onClose={() => setArchitectureOpen(false)} title="TransitSetu architecture">
      <p className="muted" style={{ marginBottom: 12 }}>
        Public buses → mobile sensing → Edge AI → structured events → fleet corroboration →
        prioritization → authority action.
      </p>
      <div className="arch">
        {nodes.map((n, i) => (
          <div key={n.k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="box">
              <b>{n.k}</b>
              {n.v}
            </div>
            {i < nodes.length - 1 && <span className="faint">→</span>}
          </div>
        ))}
      </div>
      <div className="grid-3" style={{ marginTop: 16 }}>
        <div className="mini-stat">
          <span>Bandwidth-Minimized</span>
          <b>&lt;50 KB/km target</b>
          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            Raw continuous video: NOT uploaded. Structured event metadata: uploaded.
          </div>
        </div>
        <div className="mini-stat">
          <span>Incident Fast Path</span>
          <b>Skips consensus</b>
          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            High-confidence ANPR + hashed Evidence Packet to command center.
          </div>
        </div>
        <div className="mini-stat">
          <span>Privacy-by-construction</span>
          <b>On-device anonymization</b>
          <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
            Cabin faces never leave the vehicle.
          </div>
        </div>
      </div>
    </Modal>
  )
}
