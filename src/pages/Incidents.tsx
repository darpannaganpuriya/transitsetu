import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui'
import { INCIDENTS } from '../data/mock'
import { useApp } from '../context/AppContext'

const trackSteps = [
  'Camera frame 1',
  'Vehicle detected',
  'Frame 2',
  'Vehicle tracked',
  'Frame 3',
  'Number plate detected',
  'ANPR result',
  'Evidence packet generated',
]

export function Incidents() {
  const app = useApp()
  const nav = useNavigate()
  const [id, setId] = useState('INC-2026-0142')
  const inc = INCIDENTS.find((i) => i.id === id) ?? INCIDENTS[0]
  const demoActive = app.scenario === 'hitrun'
  const lit = demoActive ? app.hitrunPhase : 7

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Incident Center</h2>
          <p>Hit-and-Run and rash driving use the Incident Fast Path — they skip Fleet Consensus.</p>
        </div>
        <button className="btn sm amber" type="button" onClick={() => { app.startHitrunDemo(); nav('/incidents') }}>
          Run Hit-and-Run Fast Path
        </button>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Type</th>
                  <th>Time</th>
                  <th>Plate</th>
                  <th>ANPR</th>
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((i) => (
                  <tr key={i.id} className={id === i.id ? 'selected' : ''} onClick={() => setId(i.id)} style={{ cursor: 'pointer' }}>
                    <td className="mono">{i.id}</td>
                    <td>
                      <Badge tone={i.type === 'Hit-and-Run' ? 'bad' : 'warn'}>{i.type}</Badge>
                    </td>
                    <td className="mono">{i.time}</td>
                    <td>{i.plate}</td>
                    <td>{i.anprConfidence}%</td>
                    <td>
                      <Badge tone={i.evidenceStatus === 'Evidence Verified' ? 'ok' : 'warn'}>{i.evidenceStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-h">
            {inc.id}
            <Badge tone="bad">{inc.type}</Badge>
          </div>
          <div className="card-b">
            <div className="stat-grid">
              <div className="mini-stat">
                <span>ANPR Confidence</span>
                <b>{inc.id === 'INC-2026-0142' ? '91%' : `${inc.anprConfidence}%`}</b>
              </div>
              <div className="mini-stat">
                <span>GPS</span>
                <b>{inc.gpsVerified ? 'Verified' : '—'}</b>
              </div>
              <div className="mini-stat">
                <span>Timestamp</span>
                <b>{inc.timestampVerified ? 'Verified' : '—'}</b>
              </div>
              <div className="mini-stat">
                <span>Evidence Hash</span>
                <b>SHA-256</b>
              </div>
            </div>
            <p className="muted" style={{ margin: '12px 0' }}>
              {inc.description}
            </p>
            <p className="mono faint">
              {inc.position.lat.toFixed(5)}, {inc.position.lng.toFixed(5)} · {inc.busId} · {inc.trackingId}
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn sm primary" type="button" onClick={() => nav('/evidence')}>
                Open Evidence Packet
              </button>
              <button className="btn sm" type="button" onClick={() => app.pushToast('Patrol unit notified (prototype)')}>
                Alert patrol
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-h">
          Vehicle tracking timeline
          <span className="muted">ByteTrack</span>
        </div>
        <div className="card-b">
          <div className="hit-path">
            {trackSteps.map((s, i) => (
              <span key={s} className={i < lit ? 'on' : ''}>
                {s}
              </span>
            ))}
          </div>
          <p className="faint" style={{ marginTop: 12, fontSize: 12 }}>
            Tracking engine: ByteTrack — identity maintained under occlusion-heavy traffic. Technical
            panel only; this prototype does not stream live camera pixels.
          </p>
        </div>
      </div>
    </div>
  )
}
