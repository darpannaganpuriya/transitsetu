import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { CommandCenter } from './pages/CommandCenter'
import { LiveFleet } from './pages/LiveFleet'
import { RoadIntelligence } from './pages/RoadIntelligence'
import { TrafficIntelligence } from './pages/TrafficIntelligence'
import { PedestrianSafety } from './pages/PedestrianSafety'
import { Incidents } from './pages/Incidents'
import { EvidenceCenter } from './pages/EvidenceCenter'
import { ConsensusEngine } from './pages/ConsensusEngine'
import { Worklist } from './pages/Worklist'
import { Alerts } from './pages/Alerts'
import { CityAnalytics } from './pages/CityAnalytics'
import { FleetAnalytics } from './pages/FleetAnalytics'
import { EdgeDevices } from './pages/EdgeDevices'
import { Privacy } from './pages/Privacy'
import { Settings } from './pages/Settings'

function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<CommandCenter />} />
            <Route path="/fleet" element={<LiveFleet />} />
            <Route path="/roads" element={<RoadIntelligence />} />
            <Route path="/traffic" element={<TrafficIntelligence />} />
            <Route path="/pedestrians" element={<PedestrianSafety />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/evidence" element={<EvidenceCenter />} />
            <Route path="/consensus" element={<ConsensusEngine />} />
            <Route path="/worklist" element={<Worklist />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<CityAnalytics />} />
            <Route path="/fleet-analytics" element={<FleetAnalytics />} />
            <Route path="/edge" element={<EdgeDevices />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
