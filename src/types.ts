export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type DefectType =
  | 'Pothole'
  | 'Damaged Road'
  | 'Missing Divider'
  | 'Missing Zebra Crossing'
  | 'Damaged Signboard'
  | 'Waterlogging'

export type DefectStatus = 'Pending Corroboration' | 'Confirmed' | 'Resolved'
export type IncidentType = 'Hit-and-Run' | 'Rash Driving'
export type BusStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'WARNING'
export type WorkStatus =
  | 'Dispatch Recommended'
  | 'Acknowledged'
  | 'Assigned'
  | 'Dispatched'
  | 'Closed'
export type Role = 'Police' | 'PWD' | 'Transport Authority'

export interface LatLng {
  lat: number
  lng: number
}

export interface Bus {
  id: string
  route: string
  status: BusStatus
  position: LatLng
  heading: number
  cameraActive: number
  cameraTotal: number
  aiOnline: boolean
  connectivity: 'Good' | 'Degraded' | 'Lost'
  storagePct: number
  lastSyncSec: number
  eventsToday: number
  fps: number
  gpuPct: number
  tempC: number
  networkKbps: number
}

export interface Defect {
  id: string
  type: DefectType
  location: string
  segment: string
  position: LatLng
  severity: Severity
  confidence: number
  buses: string[]
  firstDetected: string
  lastConfirmed: string
  status: DefectStatus
  impact: number
  factors: { severity: number; traffic: number; proximity: number }
  note: string
}

export interface Incident {
  id: string
  type: IncidentType
  time: string
  location: string
  position: LatLng
  plate: string
  anprConfidence: number
  gpsVerified: boolean
  timestampVerified: boolean
  hash: string
  trackingId: string
  busId: string
  evidenceStatus: 'Evidence Verified' | 'Packet Generated' | 'Pending Review'
  description: string
}

export interface PedestrianEvent {
  id: string
  title: string
  location: string
  segment: string
  position: LatLng
  confidence: number
  repeats: number
  risk: Severity
  time: string
}

export interface WorkItem {
  id: string
  priority: Severity
  issue: string
  location: string
  severity: Severity
  impact: number
  buses: number
  detected: string
  status: WorkStatus
  department: 'PWD' | 'Traffic Police' | 'Transport Authority'
  defectId?: string
}

export interface AlertItem {
  id: string
  severity: Severity
  title: string
  body: string
  time: string
  category: 'incident' | 'defect' | 'fleet' | 'congestion' | 'consensus'
  read: boolean
  href: string
}

export interface TrafficSegment {
  id: string
  name: string
  current: number
  baseline: number
  delayMin: number
  classes: { twoWheeler: number; car: number; bus: number; truck: number; other: number }
  path: LatLng[]
}

export interface FeedItem {
  id: string
  title: string
  meta: string
  detail: string
  time: string
  kind: 'defect' | 'traffic' | 'pedestrian' | 'incident' | 'consensus'
}

export interface EvidenceRecord {
  id: string
  incidentId: string
  plate: string
  timestamp: string
  gps: string
  confidence: number
  trackingId: string
  hash: string
  created: string
  busId: string
}
