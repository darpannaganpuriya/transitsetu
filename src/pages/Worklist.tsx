import { Badge, HumanInLoop, severityTone } from '../components/ui'
import { useApp } from '../context/AppContext'
import type { WorkStatus } from '../types'

const actions: WorkStatus[] = ['Dispatch Recommended', 'Acknowledged', 'Assigned', 'Dispatched', 'Closed']

export function Worklist() {
  const app = useApp()
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Priority Action Queue</h2>
          <p>Ranked work for PWD and transport authorities — not a firehose of map pins.</p>
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <HumanInLoop />
      </div>
      <div className="flow" style={{ marginBottom: 14 }}>
        <div className="node">AI Detection</div>
        <span className="arr">→</span>
        <div className="node">AI Recommendation</div>
        <span className="arr">→</span>
        <div className="node">Authority Review</div>
        <span className="arr">→</span>
        <div className="node">Dispatch / Acknowledge / Close</div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Issue</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Urban Impact Score</th>
                <th>Buses</th>
                <th>Detected</th>
                <th>Status</th>
                <th>Department</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {app.worklist.map((w) => (
                <tr key={w.id}>
                  <td>
                    <Badge tone={severityTone(w.priority)}>{w.priority.toUpperCase()}</Badge>
                  </td>
                  <td>{w.issue}</td>
                  <td>{w.location}</td>
                  <td>{w.severity}</td>
                  <td>{w.impact}</td>
                  <td>{w.buses}</td>
                  <td>{w.detected}</td>
                  <td>
                    <Badge tone={w.status === 'Dispatched' || w.status === 'Closed' ? 'ok' : 'warn'}>{w.status}</Badge>
                  </td>
                  <td>{w.department}</td>
                  <td>
                    <div className="row">
                      <button className="btn sm primary" type="button" onClick={() => app.setWorkStatus(w.id, 'Dispatched')}>
                        Dispatch
                      </button>
                      <button className="btn sm" type="button" onClick={() => app.setWorkStatus(w.id, 'Assigned')}>
                        Assign
                      </button>
                      <button className="btn sm" type="button" onClick={() => app.setWorkStatus(w.id, 'Acknowledged')}>
                        Acknowledge
                      </button>
                      <button className="btn sm" type="button" onClick={() => app.setWorkStatus(w.id, 'Closed')}>
                        Close
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="faint" style={{ marginTop: 10, fontSize: 12 }}>
        Status machine (authority-controlled): {actions.join(' → ')}
      </p>
    </div>
  )
}
