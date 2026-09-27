export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      background: 'var(--surface)',
      padding: '18px 24px',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: 12,
      color: 'var(--muted)',
    }}>
      {/* Left — branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: 'var(--teal)', color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
        }}>
          TS
        </div>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text)', letterSpacing: '0.06em' }}>
            TRANSITSETU
          </span>
          <span style={{ marginLeft: 8 }}>
            AI-Powered Mobile Urban Intelligence Platform
          </span>
        </div>
      </div>

      {/* Centre — team credit */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--teal-dim)',
        border: '1px solid rgba(14,124,110,0.2)',
        borderRadius: 999, padding: '5px 14px',
        fontWeight: 600, color: 'var(--teal)', fontSize: 12,
      }}>
        <span style={{ fontSize: 14 }}>🏆</span>
        MVP · Team&nbsp;<strong>818_Saksham</strong>
      </div>

      {/* Right — meta */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <span>
          <strong style={{ color: 'var(--text)' }}>PS 26124</strong>
          {' '}· MoHUA / Smart Cities Mission
        </span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>SIH 2026 Prototype</span>
        <span style={{ color: 'var(--line-strong)' }}>|</span>
        <span>© {year} Team 818_Saksham</span>
      </div>
    </footer>
  )
}
