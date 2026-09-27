import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Login() {
  const app = useApp()
  const nav = useNavigate()

  function signIn() {
    app.signIn()
    nav('/')
  }
  function demoMode() {
    app.signIn()
    app.setDemoOn(true)
    nav('/')
  }

  return (
    <div className="login">
      {/* decorative background grid */}
      <svg className="login-bg" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 72} x2="1440" y2={i * 72}
            stroke="rgba(14,124,110,0.12)" strokeWidth="1" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="800"
            stroke="rgba(14,124,110,0.08)" strokeWidth="1" />
        ))}
        {/* animated buses */}
        <circle r="5" fill="#0e7c6e" opacity="0.7">
          <animateMotion dur="18s" repeatCount="indefinite" path="M 80 600 C 350 480, 600 640, 1200 380" />
        </circle>
        <circle r="4" fill="#1d6fa4" opacity="0.7">
          <animateMotion dur="24s" repeatCount="indefinite" path="M 1380 200 C 900 320, 500 180, 100 500" />
        </circle>
        <circle r="4" fill="#c67c00" opacity="0.6">
          <animateMotion dur="20s" repeatCount="indefinite" path="M 200 100 C 500 380, 900 140, 1380 620" />
        </circle>
      </svg>

      <div className="login-card">
        {/* logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div className="brand-mark" style={{ width: 42, height: 42, fontSize: 15 }}>TS</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text)' }}>
              TRANSITSETU
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
              Ministry of Housing & Urban Affairs · SIH 2026
            </div>
          </div>
        </div>

        <div className="login-card sub" style={{ fontSize: 15, fontWeight: 600 }}>
          AI-Powered Urban Intelligence Platform
        </div>
        <div className="login-card tag">
          Converts public bus fleets into a live city sensing network — detecting road defects,
          congestion, incidents, and unsafe pedestrian situations continuously.
        </div>

        {/* form */}
        <div className="field">
          <label>Email / Authority ID</label>
          <input
            id="login-email"
            type="email"
            defaultValue="command.pwd@transitsetu.gov.in"
            placeholder="your@email.gov.in"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            id="login-password"
            type="password"
            defaultValue="••••••••"
            placeholder="••••••••"
          />
        </div>

        <div className="login-actions">
          <button id="btn-signin" className="btn primary" type="button" onClick={signIn}>
            Sign In to Command Center
          </button>
          <button id="btn-demo" className="btn" type="button" onClick={demoMode}>
            ▶ Enter Demo Mode (no credentials needed)
          </button>
        </div>

        <div style={{ marginTop: 18, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 7, fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text)' }}>Demo Mode</strong> lets you walk through the full
          prototype — pothole consensus, hit-and-run evidence, fleet map — without real credentials.
          <br />
          <span style={{ color: 'var(--faint)' }}>Prototype · PS 26124 · Sample credentials only.</span>
        </div>
      </div>
    </div>
  )
}
