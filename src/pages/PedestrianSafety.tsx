import { useState } from 'react'
import { CityMap, DEFAULT_LAYERS } from '../components/CityMap'
import { Badge, severityTone } from '../components/ui'
import { BUSES, INCIDENTS, PEDESTRIANS } from '../data/mock'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export function PedestrianSafety() {
  const app = useApp()
  const nav = useNavigate()
  const [focusId, setFocusId] = useState(PEDESTRIANS[0].id)
  const ev = PEDESTRIANS.find((p) => p.id === focusId) ?? PEDESTRIANS[0]
  const layers = { ...DEFAULT_LAYERS, buses: true, traffic: false, incidents: false, heatmap: false }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Vulnerable Pedestrian Safety</h2>
          <p>
            Detections are cross-referenced against location context (school zones, repeat-sighting
            frequency) before escalating.
          </p>
        </div>
      </div>
      <div className="grid-2">
        <CityMap
          buses={BUSES}
          defects={app.defects}
          incidents={INCIDENTS}
          pedestrians={PEDESTRIANS}
          layers={layers}
          height={420}
          focus={{ ...ev.position, zoom: 15 }}
        />
        <div className="card">
          <div className="card-h">Unsafe school crossing</div>
          <div className="card-b">
            <div className="stat-grid">
              <div className="mini-stat">
                <span>Location</span>
                <b style={{ fontSize: 14 }}>{ev.location}</b>
              </div>
              <div className="mini-stat">
                <span>Confidence</span>
                <b>{ev.confidence}%</b>
              </div>
              <div className="mini-stat">
                <span>Repeat sightings</span>
                <b>{ev.repeats}</b>
              </div>
              <div className="mini-stat">
                <span>Risk</span>
                <b>
                  <Badge tone={severityTone(ev.risk)}>{ev.risk.toUpperCase()}</Badge>
                </b>
              </div>
            </div>
            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn sm primary" type="button" onClick={() => setFocusId(ev.id)}>
                View on Map
              </button>
              <button className="btn sm" type="button" onClick={() => app.pushToast('Investigation note opened for command')}>
                Investigate
              </button>
              <button className="btn sm amber" type="button" onClick={() => nav('/worklist')}>
                Create Work Item
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Location</th>
                <th>Segment</th>
                <th>Confidence</th>
                <th>Repeats</th>
                <th>Risk</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {PEDESTRIANS.map((p) => (
                <tr key={p.id} className={focusId === p.id ? 'selected' : ''} onClick={() => setFocusId(p.id)} style={{ cursor: 'pointer' }}>
                  <td>{p.title}</td>
                  <td>{p.location}</td>
                  <td>{p.segment}</td>
                  <td>{p.confidence}%</td>
                  <td>{p.repeats}</td>
                  <td>
                    <Badge tone={severityTone(p.risk)}>{p.risk}</Badge>
                  </td>
                  <td className="mono">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
