import { useState } from 'react'
import { Badge } from '../components/ui'
import { EVIDENCE, INCIDENTS } from '../data/mock'
import { useApp } from '../context/AppContext'

export function EvidenceCenter() {
  const app = useApp()
  const [id, setId] = useState('INC-2026-0142')
  const rec = EVIDENCE.find((e) => e.incidentId === id) ?? EVIDENCE[0]
  const inc = INCIDENTS.find((i) => i.id === rec.incidentId)
  const verified = app.verifiedEvidence.includes(rec.incidentId)
  const [flash, setFlash] = useState(false)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Evidence Center</h2>
          <p>
            Integrity workflow for an Evidence Packet (hash, timestamp, GPS, ANPR Confidence). This is
            a prototype — not a claim of legal admissibility.
          </p>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Packet</th>
                  <th>Incident</th>
                  <th>Plate</th>
                  <th>ANPR</th>
                  <th>Bus</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE.map((e) => (
                  <tr key={e.id} className={id === e.incidentId ? 'selected' : ''} onClick={() => setId(e.incidentId)} style={{ cursor: 'pointer' }}>
                    <td className="mono">{e.id}</td>
                    <td className="mono">{e.incidentId}</td>
                    <td>{e.plate}</td>
                    <td>{e.confidence}%</td>
                    <td>{e.busId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            Evidence Packet
            <Badge tone={verified ? 'ok' : 'warn'}>{verified ? 'Integrity OK' : 'Unverified'}</Badge>
          </div>
          <div className="card-b">
            <div
              style={{
                height: 140,
                borderRadius: 10,
                background: 'linear-gradient(160deg,#1a2436,#0e1624)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                marginBottom: 12,
                color: 'var(--muted)',
                fontSize: 12,
              }}
            >
              Incident frame + short clip preview
              <div className="faint">Metadata-first · clip stored for confirmed incidents only</div>
            </div>
            <div className="stat-grid">
              <div className="mini-stat">
                <span>Number plate</span>
                <b style={{ fontSize: 16 }}>{rec.plate}</b>
              </div>
              <div className="mini-stat">
                <span>Timestamp</span>
                <b style={{ fontSize: 13 }}>{rec.timestamp}</b>
              </div>
              <div className="mini-stat">
                <span>GPS</span>
                <b style={{ fontSize: 13 }}>{rec.gps}</b>
              </div>
              <div className="mini-stat">
                <span>ANPR Confidence</span>
                <b>{rec.confidence}%</b>
              </div>
            </div>
            <p className="muted" style={{ margin: '12px 0 6px', fontSize: 12 }}>
              Vehicle tracking ID · {rec.trackingId} · {inc?.type}
            </p>
            <div className="hash">SHA-256 · {rec.hash}</div>
            <p className="faint" style={{ fontSize: 11, marginTop: 8 }}>
              Evidence creation time · {rec.created}
            </p>
            <button
              className="btn primary"
              style={{ marginTop: 14 }}
              type="button"
              onClick={() => {
                app.verifyEvidence(rec.incidentId)
                setFlash(true)
                window.setTimeout(() => setFlash(false), 1600)
              }}
            >
              Verify Integrity
            </button>
            {flash && (
              <p className="chip ok" style={{ marginTop: 10 }}>
                Evidence integrity verified
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
