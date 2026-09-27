import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ANALYTICS, KPIS } from '../data/mock'
import { CountUp } from '../components/ui'

const TOOLTIP_STYLE = { background: '#151e2e', border: '1px solid #2a3548', fontSize: 12 }
const PIE_COLORS = ['#d16a58', '#5b8fd4', '#c9a44a', '#3aa88f', '#b7cdf0', '#9fe0cf']

export function CityAnalytics() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>City Analytics</h2>
          <p>Weekly operational snapshot — road defects, incident trends, fleet coverage, and consensus performance. Demo telemetry.</p>
        </div>
      </div>

      {/* top KPIs */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
        {[
          { label: 'Total Defects (7 days)', value: 285, suffix: '' },
          { label: 'Confirmed by Fleet', value: KPIS.confirmedDefects, suffix: '' },
          { label: 'Incidents (7 days)', value: 37, suffix: '' },
          { label: 'km Monitored (today)', value: KPIS.kmMonitored, suffix: '' },
        ].map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top">{k.label}</div>
            <strong><CountUp value={k.value} />{k.suffix}</strong>
          </div>
        ))}
      </div>

      {/* row 1 */}
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="card">
          <div className="card-h">Road Defects — Daily Trend</div>
          <div className="card-b" style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={ANALYTICS.defectsDaily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="pothole" fill="#d16a58" radius={[3, 3, 0, 0]} name="Pothole" />
                <Bar dataKey="water" fill="#5b8fd4" radius={[3, 3, 0, 0]} name="Waterlogging" />
                <Bar dataKey="sign" fill="#c9a44a" radius={[3, 3, 0, 0]} name="Signboard" />
                <Bar dataKey="zebra" fill="#3aa88f" radius={[3, 3, 0, 0]} name="Zebra" />
                <Bar dataKey="divider" fill="#9fe0cf" radius={[3, 3, 0, 0]} name="Divider" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-h">Confirmed vs Pending (daily)</div>
          <div className="card-b" style={{ height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={ANALYTICS.confirmedVsPending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="confirmed" stroke="#3aa88f" fill="#3aa88f" fillOpacity={0.2} name="Confirmed" />
                <Area type="monotone" dataKey="pending" stroke="#c9a44a" fill="#c9a44a" fillOpacity={0.15} name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* row 2 */}
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="card">
          <div className="card-h">Consensus Engine — Hourly Performance</div>
          <div className="card-b" style={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={ANALYTICS.consensus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" stroke="#8d9aaf" fontSize={11} tickFormatter={(v) => `${v}:00`} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="corroborated" fill="#3aa88f" radius={[3, 3, 0, 0]} name="Corroborated (confirmed)" />
                <Bar dataKey="single" fill="#c9a44a" radius={[3, 3, 0, 0]} name="Single sighting (pending)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card-b" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
              Corroborated detections rise as more buses cover peak-hour corridors — exactly what fleet consensus is designed for.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-h">Detection Category Breakdown</div>
          <div className="card-b" style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={ANALYTICS.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {ANALYTICS.categories.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${v} events`, n]} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* row 3 */}
      <div className="grid-2">
        <div className="card">
          <div className="card-h">Incident Analytics — Weekly</div>
          <div className="card-b" style={{ height: 230 }}>
            <ResponsiveContainer>
              <BarChart data={ANALYTICS.incidentsWeekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="hit" fill="#d16a58" radius={[3, 3, 0, 0]} name="Hit-and-Run" />
                <Bar dataKey="rash" fill="#c9a44a" radius={[3, 3, 0, 0]} name="Rash Driving" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-h">Fleet Coverage — km Monitored (daily)</div>
          <div className="card-b" style={{ height: 230 }}>
            <ResponsiveContainer>
              <AreaChart data={ANALYTICS.coverage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8d9aaf" fontSize={11} />
                <YAxis stroke="#8d9aaf" fontSize={11} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} km`, 'Coverage']} />
                <Area type="monotone" dataKey="km" stroke="#5b8fd4" fill="#5b8fd4" fillOpacity={0.2} name="km Monitored" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
