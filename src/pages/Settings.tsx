import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Badge } from '../components/ui'

type Section = 'general' | 'detection' | 'fleet' | 'privacy' | 'notifications' | 'users'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'detection', label: 'Detection' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'users', label: 'Users & Roles' },
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--line)', gap: 16 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function Toggle({ checked }: { checked: boolean }) {
  const [on, setOn] = useState(checked)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: on ? 'var(--teal-2)' : 'var(--surface-3)',
        border: `1px solid ${on ? 'var(--teal)' : 'var(--line)'}`,
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 22 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? '#f4fffb' : 'var(--muted)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

export function Settings() {
  const app = useApp()
  const [section, setSection] = useState<Section>('general')
  const [threshold, setThreshold] = useState(60)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Settings</h2>
          <p>Platform configuration — detection, fleet, privacy, notifications, and user roles. Demo prototype.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
        {/* sidebar nav */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div style={{ padding: 8 }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`nav-link${section === s.id ? ' active' : ''}`}
                style={{ width: '100%', textAlign: 'left', display: 'block', padding: '9px 10px', fontSize: 13 }}
                onClick={() => setSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* content */}
        <div className="card">
          {section === 'general' && (
            <>
              <div className="card-h">General Settings</div>
              <div className="card-b">
                <Row label="City">
                  <select className="select" value={app.city} onChange={(e) => app.setCity(e.target.value)}>
                    <option>Bhubaneswar</option>
                    <option>Bhubaneswar (demo twin)</option>
                    <option>Indore (sandbox)</option>
                  </select>
                </Row>
                <Row label="Language">
                  <select className="select"><option>English</option><option>Odia</option><option>Hindi</option></select>
                </Row>
                <Row label="Time format">
                  <select className="select"><option>24h</option><option>12h AM/PM</option></select>
                </Row>
                <Row label="Theme">
                  <select className="select"><option>Dark (command center)</option><option>Light</option></select>
                </Row>
                <Row label="Problem statement ref">
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>PS 26124 — MoHUA / Smart Cities Mission</span>
                </Row>
              </div>
            </>
          )}

          {section === 'detection' && (
            <>
              <div className="card-h">Detection Settings</div>
              <div className="card-b">
                <Row label="Minimum confidence threshold">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="range" min={40} max={95} value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      style={{ accentColor: 'var(--teal)', width: 120 }}
                    />
                    <span style={{ fontSize: 13, minWidth: 36, color: 'var(--teal)' }}>{threshold}%</span>
                  </div>
                </Row>
                <Row label="Fleet Consensus — minimum corroborating buses">
                  <select className="select"><option>2</option><option>3</option><option>4</option></select>
                </Row>
                {[
                  { label: 'Pothole detection', on: true },
                  { label: 'Damaged road detection', on: true },
                  { label: 'Missing divider detection', on: true },
                  { label: 'Missing zebra crossing detection', on: true },
                  { label: 'Damaged / missing signboard', on: true },
                  { label: 'Waterlogging detection', on: true },
                  { label: 'Vehicle density monitoring', on: true },
                  { label: 'Vulnerable pedestrian detection', on: true },
                  { label: 'ANPR / incident detection', on: true },
                ].map((r) => (
                  <Row key={r.label} label={r.label}><Toggle checked={r.on} /></Row>
                ))}
              </div>
            </>
          )}

          {section === 'fleet' && (
            <>
              <div className="card-h">Fleet Settings</div>
              <div className="card-b">
                <Row label="Bus monitoring enabled"><Toggle checked={true} /></Row>
                <Row label="Cameras per bus">
                  <select className="select"><option>4</option><option>3</option><option>2</option></select>
                </Row>
                <Row label="Edge AI — inference engine">
                  <select className="select"><option>TensorRT INT8</option><option>TensorRT FP16</option><option>ONNX CPU</option></select>
                </Row>
                <Row label="MQTT sync interval (seconds)">
                  <input type="number" defaultValue={30} min={5} max={120} style={{ width: 80, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', fontSize: 13, color: 'var(--text)' }} />
                </Row>
                <Row label="Offline buffer (SQLite WAL)"><Toggle checked={true} /></Row>
                <Row label="Low-bandwidth mode (QUIC)"><Toggle checked={false} /></Row>
                <Row label="Storage alert threshold (%)">
                  <input type="number" defaultValue={80} min={50} max={99} style={{ width: 80, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', fontSize: 13, color: 'var(--text)' }} />
                </Row>
              </div>
            </>
          )}

          {section === 'privacy' && (
            <>
              <div className="card-h">Privacy Settings</div>
              <div className="card-b">
                <Row label="On-device face anonymization"><Toggle checked={true} /></Row>
                <Row label="Cabin frame processing"><Toggle checked={true} /></Row>
                <Row label="Data retention — event metadata (days)">
                  <select className="select"><option>30</option><option>60</option><option>90</option><option>180</option></select>
                </Row>
                <Row label="Data retention — evidence clips (days)">
                  <select className="select"><option>90</option><option>180</option><option>365</option></select>
                </Row>
                <Row label="Raw video uplink to cloud"><Toggle checked={false} /></Row>
                <div className="hitl" style={{ marginTop: 12 }}>
                  Privacy-by-construction: raw faces never leave the vehicle. Enabling raw video uplink is disabled
                  in this prototype in line with DPDP Act 2023 principles.
                </div>
              </div>
            </>
          )}

          {section === 'notifications' && (
            <>
              <div className="card-h">Notification Settings</div>
              <div className="card-b">
                {[
                  { label: 'Critical incidents (hit-and-run)', on: true },
                  { label: 'High-impact road defects confirmed', on: true },
                  { label: 'Fleet bus offline alerts', on: true },
                  { label: 'High congestion alerts', on: true },
                  { label: 'Pending corroboration — school zone', on: true },
                  { label: 'Evidence packet generated', on: true },
                  { label: 'Fleet connectivity degraded', on: false },
                  { label: 'Low-confidence single sightings', on: false },
                ].map((r) => (
                  <Row key={r.label} label={r.label}><Toggle checked={r.on} /></Row>
                ))}
              </div>
            </>
          )}

          {section === 'users' && (
            <>
              <div className="card-h">Users & Roles (RBAC)</div>
              <div className="card-b">
                <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
                  TransitSetu uses role-based access control (Keycloak OIDC + JWT). Each role sees a
                  scoped view of the dashboard.
                </p>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Access</th>
                        <th>Key pages</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: 'PWD', access: 'Road defects, worklist, analytics', pages: 'Roads, Worklist, Analytics', active: true },
                        { role: 'Traffic Police', access: 'Incidents, evidence center, ANPR', pages: 'Incidents, Evidence, Fleet', active: true },
                        { role: 'Transport Authority', access: 'Full dashboard, fleet, settings', pages: 'All sections', active: true },
                        { role: 'City Command', access: 'Read-only overview', pages: 'Command Center, Analytics', active: false },
                      ].map((r) => (
                        <tr key={r.role}>
                          <td><strong>{r.role}</strong></td>
                          <td className="muted" style={{ fontSize: 12 }}>{r.access}</td>
                          <td className="muted" style={{ fontSize: 12 }}>{r.pages}</td>
                          <td><Badge tone={r.active ? 'ok' : 'neutral'}>{r.active ? 'Active' : 'Inactive'}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hitl" style={{ marginTop: 14 }}>
                  Auth: Keycloak OIDC + JWT + RBAC. Role separation for Police / PWD / Transport Authority personas.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
