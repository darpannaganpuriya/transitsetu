import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Footer } from './Footer'
import {
  Activity,
  Bell,
  Bus,
  Cpu,
  Database,
  Footprints,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Map,
  Radio,
  Settings,
  Shield,
  Siren,
  Workflow,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ArchitectureModal } from './ArchitectureModal'
import { DemoBar } from './DemoBar'
import { useState } from 'react'

const groups = [
  {
    label: 'Command Center',
    items: [
      { to: '/',            icon: LayoutDashboard, label: 'Overview',           desc: 'Map + live feed' },
      { to: '/fleet',       icon: Bus,             label: 'Live Fleet',          desc: 'Bus locations & status' },
      { to: '/roads',       icon: Map,             label: 'Road Intelligence',   desc: 'Potholes, defects' },
      { to: '/traffic',     icon: Activity,        label: 'Traffic Intelligence',desc: 'Congestion & density' },
      { to: '/pedestrians', icon: Footprints,      label: 'Pedestrian Safety',   desc: 'Unsafe crossings' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/incidents', icon: Siren,      label: 'Incidents',         desc: 'Hit-and-run, rash driving' },
      { to: '/evidence',  icon: Shield,     label: 'Evidence Center',   desc: 'SHA-256 evidence packets' },
      { to: '/consensus', icon: Workflow,   label: 'Consensus Engine',  desc: 'Fleet corroboration' },
      { to: '/worklist',  icon: ListChecks, label: 'Priority Worklist', desc: 'PWD action queue' },
      { to: '/alerts',    icon: Bell,       label: 'Alerts',            desc: 'Critical notifications' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { to: '/analytics',       icon: Database, label: 'City Analytics',  desc: 'Defect & incident trends' },
      { to: '/fleet-analytics', icon: Radio,    label: 'Fleet Analytics', desc: 'Edge device telemetry' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/edge',    icon: Cpu,          label: 'Edge Devices', desc: 'Jetson Orin Nano health' },
      { to: '/privacy', icon: Shield,       label: 'Privacy',      desc: 'On-device anonymization' },
      { to: '/settings',icon: Settings,     label: 'Settings',     desc: 'Platform configuration' },
    ],
  },
]

export function Layout() {
  const app = useApp()
  const nav = useNavigate()
  const unread = app.alerts.filter((a) => !a.read).length
  const [notes, setNotes] = useState(false)
  const [menu, setMenu] = useState(false)

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">TS</div>
          <div>
            <h1>TRANSITSETU</h1>
            <p>Urban Intelligence</p>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.label}>
            <div className="nav-group">{g.label}</div>
            {g.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                title={it.desc}
              >
                <it.icon />
                <span>{it.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: '8px 10px', display: 'grid', gap: 6 }}>
          <button
            className="btn sm"
            type="button"
            style={{ fontSize: 11 }}
            onClick={() => app.setArchitectureOpen(true)}
          >
            🏗 View Architecture
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-col">
        {/* topbar */}
        <header className="topbar">
          <div className="topbar-title">
            <strong>Urban Intelligence Command Center</strong>
            {app.city} · Smart Cities Mission · PS 26124
          </div>
          <div className="top-actions">
            <select
              className="select"
              value={app.city}
              onChange={(e) => app.setCity(e.target.value)}
              aria-label="Select city"
            >
              <option>Bhubaneswar</option>
              <option>Bhubaneswar (demo twin)</option>
              <option>Indore (sandbox)</option>
            </select>

            <div className="status-pill">
              <span className="dot" />
              Live · demo data
            </div>

            <button
              id="btn-demo-mode"
              className={`btn sm ${app.demoOn ? 'primary' : ''}`}
              type="button"
              onClick={() => {
                app.setDemoOn(!app.demoOn)
                if (!app.demoOn) nav('/consensus')
              }}
            >
              {app.demoOn ? '⏹ Stop Demo' : '▶ Demo Mode'}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                className="icon-btn"
                type="button"
                onClick={() => setNotes((v) => !v)}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unread > 0 && <span className="badge-n">{unread}</span>}
              </button>
              {notes && (
                <div className="notif-pop">
                  <div className="card-h">
                    Alerts ({unread} unread)
                    <button className="btn sm ghost" type="button" onClick={() => { nav('/alerts'); setNotes(false) }}>
                      See all
                    </button>
                  </div>
                  {app.alerts.slice(0, 5).map((a) => (
                    <div key={a.id} className={`notif-item${a.read ? '' : ' unread'}`}>
                      <strong>{a.title}</strong>
                      <div className="muted" style={{ marginTop: 2 }}>{a.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <div style={{ position: 'relative' }}>
              <button className="user-chip" type="button" onClick={() => setMenu((v) => !v)}>
                <span className="avatar">KA</span>
                PWD Officer
              </button>
              {menu && (
                <div className="notif-pop" style={{ width: 220 }}>
                  <div className="notif-item">
                    <strong>Role: PWD (RBAC)</strong>
                    <div className="muted" style={{ marginTop: 2 }}>Police / Transport roles in Settings</div>
                  </div>
                  <div style={{ padding: 10 }}>
                    <button
                      className="btn sm danger"
                      style={{ width: '100%' }}
                      type="button"
                      onClick={() => { app.signOut(); nav('/login') }}
                    >
                      <LogOut size={13} style={{ marginRight: 4 }} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* demo bar */}
        {(app.demoOn || app.scenario !== 'idle') && <DemoBar />}

        <Outlet />
        <Footer />
      </div>

      <ArchitectureModal />

      {/* Toast stack */}
      <div className="toast-stack">
        {app.toasts.map((t) => (
          <div key={t.id} className="toast">{t.text}</div>
        ))}
      </div>
    </div>
  )
}
