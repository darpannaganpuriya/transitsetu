import { useNavigate } from 'react-router-dom'
import { Badge, HumanInLoop, ImpactBars } from '../components/ui'
import { useApp } from '../context/AppContext'

export function ConsensusEngine() {
  const app = useApp()
  const nav = useNavigate()
  const phase = app.scenario === 'consensus' ? app.consensusPhase : 5
  const fused = phase >= 4
  const busB = phase >= 2
  const defect = app.defects.find((d) => d.id === 'DEF-2026-0841')

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Fleet Consensus Engine</h2>
          <p>
            A road defect is only marked <strong>Confirmed</strong> after two or more independent
            buses report the same issue at the same location. This prevents false alarms from a
            single camera glitch or passing debris.
          </p>
        </div>
        <button className="btn primary sm" type="button" onClick={app.startConsensusDemo}>
          ▶ Run live pothole demo
        </button>
      </div>

      {/* How it works callout */}
      <div style={{
        background: 'var(--teal-dim)', border: '1px solid rgba(14,124,110,0.2)',
        borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13,
        lineHeight: 1.6, color: 'var(--text)',
      }}>
        <strong>How the consensus formula works:</strong>{' '}
        When Bus A detects a pothole at 62% confidence and Bus B independently detects the same
        pothole (same GPS cluster, same road segment) at 58% confidence, the Consensus Engine
        fuses both readings using a Bayesian formula:{' '}
        <code style={{ fontFamily: 'var(--mono)', background: 'rgba(14,124,110,0.1)', padding: '1px 5px', borderRadius: 4 }}>
          1 − (1 − 0.62) × (1 − 0.58) = 0.84
        </code>
        {' '}— giving 84% combined confidence, which exceeds the confirmation threshold.
      </div>

      {/* Main consensus visualization */}
      <div className="consensus" style={{ marginBottom: 16 }}>
        {/* Bus A */}
        <div className="bus-card" style={phase >= 1 ? { borderColor: 'rgba(14,124,110,0.4)' } : {}}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
            STEP 1 — FIRST BUS PASS
          </div>
          <h3>Bus A · TS-104</h3>
          <p className="muted" style={{ margin: '4px 0 12px', fontSize: 13 }}>
            Detects pothole on School Road — Segment 12
          </p>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Detection confidence:</div>
          <div className="conf-num" style={{ color: phase >= 1 ? 'var(--teal)' : 'var(--faint)' }}>62%</div>
          <div style={{ marginTop: 10 }}>
            <Badge tone="warn">⏳ Pending Corroboration</Badge>
          </div>
          <p className="faint" style={{ marginTop: 10, fontSize: 12 }}>
            Entered into pending queue — waiting for a second bus to independently confirm this location.
          </p>
        </div>

        {/* Fusion ring */}
        <div className="fuse-col">
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 8 }}>
            STEP 3 — BAYESIAN FUSION
          </div>
          <div className={`fuse-ring${fused ? ' live' : ''}`}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>FUSED CONFIDENCE</div>
              <div className="conf-num" style={{ fontSize: 28, color: fused ? 'var(--teal)' : 'var(--faint)' }}>
                {fused ? '84%' : '—'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', maxWidth: 160 }}>
            <code style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>62% + 58% → 84%</code>
            <div className="faint" style={{ marginTop: 4, fontSize: 11 }}>
              1 − (1−0.62)(1−0.58) ≈ 0.84
            </div>
          </div>
          {fused && (
            <Badge tone="ok">✓ CONFIRMED — DISPATCH</Badge>
          )}
        </div>

        {/* Bus B */}
        <div className="bus-card" style={busB ? { borderColor: 'rgba(14,124,110,0.4)' } : {}}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>
            STEP 2 — SECOND BUS PASS (20 min later)
          </div>
          <h3>Bus B · TS-109</h3>
          <p className="muted" style={{ margin: '4px 0 12px', fontSize: 13 }}>
            Same pothole detected — independent reading
          </p>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Detection confidence:</div>
          <div className="conf-num" style={{ opacity: busB ? 1 : 0.2, color: busB ? 'var(--teal)' : 'var(--faint)' }}>
            58%
          </div>
          <div style={{ marginTop: 10 }}>
            <Badge tone={busB ? 'ok' : 'neutral'}>
              {busB ? '✓ Independent confirmation' : 'Awaiting second bus pass…'}
            </Badge>
          </div>
          <p className="faint" style={{ marginTop: 10, fontSize: 12 }}>
            Same GPS cluster, same road segment — confirmed as separate independent detection.
          </p>
        </div>
      </div>

      <div className="grid-2">
        {/* Checks performed */}
        <div className="card">
          <div className="card-h">What the Consensus Engine checks</div>
          <div className="card-b">
            <table>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>GPS proximity</td>
                  <td>{phase >= 3 ? <Badge tone="ok">✓ Match — same GPS cluster (SEG-12)</Badge> : <span className="faint">Not yet checked</span>}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Detection type</td>
                  <td>{phase >= 3 ? <Badge tone="ok">✓ Pothole = Pothole</Badge> : <span className="faint">Not yet checked</span>}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Timestamp gap</td>
                  <td>{phase >= 3 ? <Badge tone="ok">✓ ~20 min apart (valid)</Badge> : <span className="faint">Not yet checked</span>}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Road segment ID</td>
                  <td>{phase >= 3 ? <Badge tone="ok">✓ SEG-12 (both buses)</Badge> : <span className="faint">Not yet checked</span>}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>Fused confidence</td>
                  <td><strong>{fused ? '84% — exceeds threshold' : 'Pending fusion'}</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              Spatial clustering: <strong>DBSCAN algorithm</strong>.
              Confidence fusion: <strong>Bayesian probability model</strong>.
            </p>
          </div>
        </div>

        {/* Outcome */}
        <div className="card">
          <div className="card-h">
            Decision outcome
            <Badge tone={fused ? 'ok' : 'warn'}>
              {fused ? '✓ CONFIRMED — DISPATCH' : 'Pending Corroboration'}
            </Badge>
          </div>
          <div className="card-b">
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{defect?.note}</p>

            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Urban Impact Score: {defect?.impact} / 100
            </div>
            <div style={{ marginBottom: 10, fontSize: 12, color: 'var(--muted)' }}>
              Score = Severity × Traffic Volume × Proximity to sensitive locations
            </div>
            {defect && <ImpactBars {...defect.factors} />}

            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--red-dim)', borderRadius: 7, fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>
              ⚠ HIGH PRIORITY — Near school zone + high traffic volume
            </div>

            <div className="row" style={{ marginTop: 14 }}>
              <button
                className="btn primary sm"
                type="button"
                onClick={() => {
                  if (app.scenario === 'consensus' && app.consensusPhase < 7) {
                    app.advanceConsensus()
                  }
                  app.setWorkStatus('WL-091', 'Dispatched')
                  nav('/worklist')
                }}
              >
                Dispatch PWD crew
              </button>
              <button className="btn sm" type="button" onClick={() => app.setWorkStatus('WL-091', 'Acknowledged')}>
                Acknowledge
              </button>
            </div>
            <div style={{ marginTop: 14 }}>
              <HumanInLoop />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
