import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ALERTS,
  DEFECTS,
  FEED_SEED,
  WORKLIST,
} from '../data/mock'
import type {
  AlertItem,
  Defect,
  FeedItem,
  WorkItem,
  WorkStatus,
} from '../types'

export type DemoScenario = 'idle' | 'consensus' | 'hitrun'
export type ConsensusPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

type Toast = { id: string; text: string }

interface AppState {
  authed: boolean
  city: string
  demoOn: boolean
  scenario: DemoScenario
  consensusPhase: ConsensusPhase
  hitrunPhase: number
  defects: Defect[]
  worklist: WorkItem[]
  alerts: AlertItem[]
  feed: FeedItem[]
  toasts: Toast[]
  verifiedEvidence: string[]
  architectureOpen: boolean
  signIn: () => void
  signOut: () => void
  setCity: (c: string) => void
  setDemoOn: (v: boolean) => void
  startConsensusDemo: () => void
  startHitrunDemo: () => void
  advanceConsensus: () => void
  advanceHitrun: () => void
  resetDemo: () => void
  setWorkStatus: (id: string, status: WorkStatus) => void
  markAlertRead: (id: string) => void
  acknowledgeAlert: (id: string) => void
  verifyEvidence: (id: string) => void
  pushToast: (text: string) => void
  setArchitectureOpen: (v: boolean) => void
}

const Ctx = createContext<AppState | null>(null)

function cloneDefects(): Defect[] {
  return DEFECTS.map((d) => ({ ...d, buses: [...d.buses], factors: { ...d.factors } }))
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [city, setCity] = useState('Bhubaneswar')
  const [demoOn, setDemoOn] = useState(false)
  const [scenario, setScenario] = useState<DemoScenario>('idle')
  const [consensusPhase, setConsensusPhase] = useState<ConsensusPhase>(0)
  const [hitrunPhase, setHitrunPhase] = useState(0)
  const [defects, setDefects] = useState<Defect[]>(cloneDefects)
  const [worklist, setWorklist] = useState<WorkItem[]>(() => WORKLIST.map((w) => ({ ...w })))
  const [alerts, setAlerts] = useState<AlertItem[]>(() => ALERTS.map((a) => ({ ...a })))
  const [feed, setFeed] = useState<FeedItem[]>(() => [...FEED_SEED])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [verifiedEvidence, setVerifiedEvidence] = useState<string[]>(['INC-2026-0142', 'INC-2026-0124'])
  const [architectureOpen, setArchitectureOpen] = useState(false)

  const pushToast = useCallback((text: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((t) => [...t, { id, text }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  const resetDefectsBase = useCallback(() => {
    setDefects(cloneDefects())
    setWorklist(WORKLIST.map((w) => ({ ...w })))
  }, [])

  const applyConsensusPhase = useCallback((phase: ConsensusPhase) => {
    setDefects((prev) =>
      prev.map((d) => {
        if (d.id !== 'DEF-2026-0841') return d
        if (phase < 2) {
          return {
            ...d,
            confidence: 62,
            buses: ['TS-104'],
            status: 'Pending Corroboration',
            lastConfirmed: '—',
          }
        }
        if (phase < 4) {
          return {
            ...d,
            confidence: 62,
            buses: ['TS-104', 'TS-109'],
            status: 'Pending Corroboration',
            lastConfirmed: '—',
          }
        }
        return {
          ...d,
          confidence: 84,
          buses: ['TS-104', 'TS-109'],
          status: 'Confirmed',
          lastConfirmed: '2026-09-27 16:01:40',
        }
      }),
    )
    setWorklist((prev) =>
      prev.map((w) => {
        if (w.defectId !== 'DEF-2026-0841') return w
        if (phase >= 7) return { ...w, status: 'Dispatched', buses: 2 }
        if (phase >= 4) return { ...w, status: 'Dispatch Recommended', buses: 2 }
        return { ...w, buses: phase >= 2 ? 2 : 1, status: 'Dispatch Recommended' }
      }),
    )
  }, [])

  const startConsensusDemo = useCallback(() => {
    setDemoOn(true)
    setScenario('consensus')
    setConsensusPhase(1)
    applyConsensusPhase(1)
    setFeed((f) => [
      {
        id: `demo-${Date.now()}`,
        title: 'Pothole detected',
        meta: 'Bus TS-104',
        detail: 'Confidence 62% · Pending Corroboration',
        time: 'just now',
        kind: 'defect',
      },
      ...f,
    ])
    pushToast('Demo Mode · Pothole Consensus — Bus A sighting')
  }, [applyConsensusPhase, pushToast])

  const advanceConsensus = useCallback(() => {
    setConsensusPhase((p) => {
      const next = Math.min(7, p + 1) as ConsensusPhase
      applyConsensusPhase(next)
      if (next === 2) {
        setFeed((f) => [
          {
            id: `demo-${Date.now()}`,
            title: 'Pothole detected',
            meta: 'Bus TS-109',
            detail: 'Confidence 58% · same GPS cluster',
            time: 'just now',
            kind: 'defect',
          },
          ...f,
        ])
        pushToast('Bus B independent sighting · 58%')
      }
      if (next === 4) {
        setFeed((f) => [
          {
            id: `demo-${Date.now()}`,
            title: 'Fleet Consensus Engine fused',
            meta: '62% + 58% → 84%',
            detail: 'Confirmed — Dispatch',
            time: 'just now',
            kind: 'consensus',
          },
          ...f,
        ])
        pushToast('Posterior confidence 84% · Confirmed — Dispatch')
      }
      if (next === 7) {
        pushToast('Authority dispatched PWD crew · Human-in-the-loop')
      }
      return next
    })
  }, [applyConsensusPhase, pushToast])

  const startHitrunDemo = useCallback(() => {
    setDemoOn(true)
    setScenario('hitrun')
    setHitrunPhase(1)
    pushToast('Demo Mode · Incident Fast Path — vehicle detected')
  }, [pushToast])

  const advanceHitrun = useCallback(() => {
    setHitrunPhase((p) => {
      const next = Math.min(7, p + 1)
      if (next === 7) pushToast('Command center alert issued · Evidence Packet ready')
      return next
    })
  }, [pushToast])

  const resetDemo = useCallback(() => {
    setScenario('idle')
    setConsensusPhase(0)
    setHitrunPhase(0)
    resetDefectsBase()
    setFeed([...FEED_SEED])
    pushToast('Demo reset to baseline theatre data')
  }, [pushToast, resetDefectsBase])

  const setWorkStatus = useCallback(
    (id: string, status: WorkStatus) => {
      setWorklist((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)))
      pushToast(`Priority Action Queue · ${id} → ${status}`)
    },
    [pushToast],
  )

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [])

  const acknowledgeAlert = useCallback(
    (id: string) => {
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
      pushToast(`Alert ${id} acknowledged`)
    },
    [pushToast],
  )

  const verifyEvidence = useCallback(
    (id: string) => {
      setVerifiedEvidence((prev) => (prev.includes(id) ? prev : [...prev, id]))
      pushToast('Evidence integrity verified')
    },
    [pushToast],
  )

  const value = useMemo<AppState>(
    () => ({
      authed,
      city,
      demoOn,
      scenario,
      consensusPhase,
      hitrunPhase,
      defects,
      worklist,
      alerts,
      feed,
      toasts,
      verifiedEvidence,
      architectureOpen,
      signIn: () => setAuthed(true),
      signOut: () => setAuthed(false),
      setCity,
      setDemoOn,
      startConsensusDemo,
      startHitrunDemo,
      advanceConsensus,
      advanceHitrun,
      resetDemo,
      setWorkStatus,
      markAlertRead,
      acknowledgeAlert,
      verifyEvidence,
      pushToast,
      setArchitectureOpen,
    }),
    [
      acknowledgeAlert,
      advanceConsensus,
      advanceHitrun,
      alerts,
      architectureOpen,
      authed,
      city,
      consensusPhase,
      defects,
      demoOn,
      feed,
      hitrunPhase,
      markAlertRead,
      pushToast,
      resetDemo,
      scenario,
      setWorkStatus,
      startConsensusDemo,
      startHitrunDemo,
      toasts,
      verifiedEvidence,
      verifyEvidence,
      worklist,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}
