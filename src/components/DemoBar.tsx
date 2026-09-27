import { useApp } from '../context/AppContext'

export function DemoBar() {
  const app = useApp()
  const consensusSteps = [
    'Idle',
    'Bus A detects pothole — 62% · Pending Corroboration',
    'Bus B detects same pothole — 58%',
    'Fleet Consensus Engine compares GPS, type, time, segment',
    'Fused posterior 84%',
    'CONFIRMED — DISPATCH',
    'Urban Impact Score: HIGH (school zone)',
    'Authority DISPATCH',
  ]
  const hitSteps = [
    'Idle',
    'Vehicle detected',
    'Vehicle tracked (ByteTrack)',
    'Frame 3 · identity held',
    'Number plate detected',
    'ANPR result — 91%',
    'Evidence Packet + SHA-256',
    'Command center alert',
  ]

  const isC = app.scenario === 'consensus'
  const isH = app.scenario === 'hitrun'
  const label = isC ? consensusSteps[app.consensusPhase] : isH ? hitSteps[app.hitrunPhase] : 'Demo Mode on — choose a scenario'

  return (
    <div className="demo-bar">
      <div>
        <strong>Demo Mode</strong>
        <span className="muted"> · {label}</span>
      </div>
      <div className="row">
        {app.scenario === 'idle' && (
          <>
            <button className="btn sm primary" type="button" onClick={app.startConsensusDemo}>
              Pothole Consensus
            </button>
            <button className="btn sm amber" type="button" onClick={app.startHitrunDemo}>
              Hit-and-Run Fast Path
            </button>
          </>
        )}
        {isC && app.consensusPhase < 7 && (
          <button className="btn sm primary" type="button" onClick={app.advanceConsensus}>
            Next step
          </button>
        )}
        {isH && app.hitrunPhase < 7 && (
          <button className="btn sm primary" type="button" onClick={app.advanceHitrun}>
            Next step
          </button>
        )}
        <button className="btn sm" type="button" onClick={app.resetDemo}>
          Reset
        </button>
      </div>
    </div>
  )
}
