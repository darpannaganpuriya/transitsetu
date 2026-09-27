import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge } from '../components/ui'
import { TRAFFIC } from '../data/mock'

const densitySeries = [
  { t: '06:00', current: 22, baseline: 20 },
  { t: '08:00', current: 71, baseline: 58 },
  { t: '10:00', current: 64, baseline: 52 },
  { t: '12:00', current: 55, baseline: 49 },
  { t: '14:00', current: 61, baseline: 54 },
  { t: '16:00', current: 82, baseline: 55 },
  { t: '18:00', current: 90, baseline: 70 },
  { t: '20:00', current: 48, baseline: 44 },
]

export function TrafficIntelligence() {
  const focus = TRAFFIC[0]
  const deviation = Math.round(((focus.current - focus.baseline) / focus.baseline) * 100)
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Traffic Intelligence</h2>
          <p>
            Congestion is compared against the historical norm of that specific road segment — not a
            flat threshold across arterial and residential roads.
          </p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-h">
          {focus.name}
          <Badge tone="bad">HIGH CONGESTION</Badge>
        </div>
        <div className="card-b">
          <div className="stat-grid">
            <div className="mini-stat">
              <span>Current density</span>
              <b>{focus.current} vehicles/min</b>
            </div>
            <div className="mini-stat">
              <span>Historical baseline</span>
              <b>{focus.baseline} vehicles/min</b>
            </div>
            <div className="mini-stat">
              <span>Deviation</span>
              <b>+{deviation}%</b>
            </div>
            <div className="mini-stat">
              <span>Route delay estimate</span>
              <b>{focus.delayMin} min</b>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-h">Segment density vs its own baseline</div>
          <div className="card-b" style={{ height: 280 }}>
            <ResponsiveContainer>
              <AreaChart data={densitySeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={{ background: '#151e2e', border: '1px solid #2a3548' }} />
                <Area type="monotone" dataKey="baseline" stroke="#5b8fd4" fill="#5b8fd4" fillOpacity={0.15} name="Historical baseline" />
                <Area type="monotone" dataKey="current" stroke="#3aa88f" fill="#3aa88f" fillOpacity={0.25} name="Current density" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-h">Vehicle classification — {focus.name}</div>
          <div className="card-b" style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart
                data={[
                  { n: '2W', v: focus.classes.twoWheeler },
                  { n: 'Car', v: focus.classes.car },
                  { n: 'Bus', v: focus.classes.bus },
                  { n: 'Truck', v: focus.classes.truck },
                  { n: 'Other', v: focus.classes.other },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={{ background: '#151e2e', border: '1px solid #2a3548' }} />
                <Bar dataKey="v" fill="#c9a44a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="card-h">All monitored segments</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Road segment</th>
                <th>Current</th>
                <th>Baseline</th>
                <th>Congestion score</th>
                <th>Delay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {TRAFFIC.map((s) => {
                const d = Math.round(((s.current - s.baseline) / s.baseline) * 100)
                const high = d >= 35
                return (
                  <tr key={s.id}>
                    <td>
                      {s.name}
                      <div className="faint">{s.id}</div>
                    </td>
                    <td>{s.current} veh/min</td>
                    <td>{s.baseline} veh/min</td>
                    <td>+{d}%</td>
                    <td>{s.delayMin} min</td>
                    <td>
                      <Badge tone={high ? 'bad' : d > 10 ? 'warn' : 'ok'}>{high ? 'HIGH CONGESTION' : d > 10 ? 'ELEVATED' : 'NORMAL'}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
