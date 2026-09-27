export function Privacy() {
  const steps = [
    { label: 'Camera', detail: 'Front / rear / side / cabin feeds captured on-device' },
    { label: 'Face Detected', detail: 'On-device face detector identifies persons in cabin frames' },
    { label: 'Anonymization', detail: 'Faces blurred / pixelated on Jetson Orin Nano before further processing' },
    { label: 'AI Processing', detail: 'Only anonymized frames pass to road-defect / pedestrian analysis heads' },
    { label: 'Metadata Uplink', detail: 'Structured JSON event metadata synced to cloud — no raw faces' },
  ]

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Privacy Center</h2>
          <p>
            Privacy-by-construction — cabin footage is anonymized on-device before any further processing.
            Raw faces never leave the vehicle, directly addressing DPDP Act 2023 exposure.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 12 }}>
        {/* pipeline card */}
        <div className="card">
          <div className="card-h">On-Device Privacy Filter Pipeline</div>
          <div className="card-b">
            <div className="timeline">
              {steps.map((s, i) => (
                <div className="tl-step on" key={s.label}>
                  <div>
                    <div className="blob" />
                    {i < steps.length - 1 && <div className="rail" />}
                  </div>
                  <div style={{ paddingBottom: 18 }}>
                    <strong style={{ fontSize: 13 }}>{s.label}</strong>
                    <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* status cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card">
            <div className="card-h">Privacy Status</div>
            <div className="card-b">
              {[
                { label: 'On-device face anonymization', status: 'Active', tone: 'ok' as const, detail: 'All cabin frames processed before analysis' },
                { label: 'Raw video uplink', status: 'Disabled', tone: 'ok' as const, detail: 'Continuous raw video never leaves the bus' },
                { label: 'Evidence clip uplink', status: 'Confirmed incidents only', tone: 'warn' as const, detail: 'Short clip for confirmed hit-and-run / rash driving' },
                { label: 'Metadata-only uplink', status: 'Enabled', tone: 'ok' as const, detail: 'Structured JSON — no PII in metadata' },
                { label: 'On-device storage', status: 'Encrypted', tone: 'ok' as const, detail: 'SQLite WAL with encryption at rest (demo)' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--line)', gap: 12 }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{s.detail}</div>
                  </div>
                  <span className={`chip ${s.tone}`} style={{ whiteSpace: 'nowrap' }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-h">Regulatory Context</div>
            <div className="card-b">
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
                The Digital Personal Data Protection Act 2023 (DPDP Act) places obligations on entities processing
                personal data including biometric identifiers such as faces. TransitSetu's privacy-by-construction
                approach ensures faces are anonymized on-device before any inference result or clip is transmitted,
                minimizing DPDP Act exposure.
              </p>
              <div className="hitl" style={{ marginTop: 12 }}>
                <strong>This is a prototype demonstration.</strong> Full legal compliance assessment would require
                formal review by qualified legal counsel before production deployment.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* data flow visualization */}
      <div className="card">
        <div className="card-h">Data Flow Summary</div>
        <div className="card-b">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {[
              { label: 'Raw Camera Feed', goes: 'Stays on bus', icon: '📷', ok: true },
              { label: 'Faces (detected)', goes: 'Anonymized on-device', icon: '👤', ok: true },
              { label: 'Road Defect Metadata', goes: 'Uploaded (JSON)', icon: '📦', ok: true },
              { label: 'ANPR / Number Plate', goes: 'Uploaded (confirmed incidents only)', icon: '🔢', ok: true },
              { label: 'GPS Trace', goes: 'Uploaded with event', icon: '📍', ok: true },
              { label: 'Evidence Clip', goes: 'Confirmed incidents only', icon: '🎬', ok: false },
            ].map((d) => (
              <div className="mini-stat" key={d.label} style={{ borderColor: d.ok ? 'rgba(58,168,143,0.2)' : 'rgba(201,164,74,0.2)' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{d.icon}</div>
                <span>{d.label}</span>
                <b style={{ fontSize: 12, marginTop: 6, color: d.ok ? 'var(--ok)' : 'var(--amber)' }}>{d.goes}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
