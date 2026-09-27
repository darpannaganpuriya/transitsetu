import { useEffect, useMemo } from 'react'
import { Circle, CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import { CITY, HOSPITAL_ZONES, SCHOOL_ZONES, TRAFFIC } from '../data/mock'
import type { Bus, Defect, Incident, PedestrianEvent } from '../types'

export interface MapLayers {
  buses: boolean
  infrastructure: boolean
  incidents: boolean
  traffic: boolean
  context: boolean
  heatmap: boolean
  pending: boolean
}

function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], zoom)
  }, [lat, lng, map, zoom])
  return null
}

export function CityMap({
  buses,
  defects,
  incidents,
  pedestrians,
  layers,
  height = 540,
  focus,
}: {
  buses: Bus[]
  defects: Defect[]
  incidents: Incident[]
  pedestrians: PedestrianEvent[]
  layers: MapLayers
  height?: number
  focus?: { lat: number; lng: number; zoom?: number }
}) {
  const center = focus ?? CITY.center
  const zoom = focus?.zoom ?? CITY.zoom

  const heat = useMemo(() => {
    return defects
      .filter((d) => d.status === 'Confirmed')
      .map((d) => ({ ...d.position, r: d.severity === 'critical' ? 420 : d.severity === 'high' ? 320 : 220 }))
  }, [defects])

  return (
    <div className="map-wrap" style={{ minHeight: height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        zoomControl
        style={{ height, width: '100%' }}
        attributionControl={false}
      >
        <Recenter lat={center.lat} lng={center.lng} zoom={zoom} />
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {layers.traffic &&
          TRAFFIC.map((seg) => {
            const ratio = seg.current / seg.baseline
            const color = ratio > 1.35 ? '#d16a58' : ratio > 1.1 ? '#c9a44a' : '#3aa88f'
            return (
              <Polyline
                key={seg.id}
                positions={seg.path.map((p) => [p.lat, p.lng] as [number, number])}
                pathOptions={{ color, weight: 5, opacity: 0.8 }}
              >
                <Popup>
                  <strong>{seg.name}</strong>
                  <br />
                  Current {seg.current} veh/min vs baseline {seg.baseline}
                  <br />
                  Deviation {Math.round((ratio - 1) * 100)}%
                </Popup>
              </Polyline>
            )
          })}

        {layers.heatmap &&
          heat.map((h) => (
            <Circle
              key={`${h.lat}-${h.lng}`}
              center={[h.lat, h.lng]}
              radius={h.r}
              pathOptions={{ color: '#c0392b', fillColor: '#c0392b', fillOpacity: 0.18, weight: 0 }}
            />
          ))}

        {layers.context &&
          SCHOOL_ZONES.map((z) => (
            <Circle
              key={z.id}
              center={[z.position.lat, z.position.lng]}
              radius={280}
              pathOptions={{ color: '#c67c00', fillColor: '#c67c00', fillOpacity: 0.12, weight: 2, dashArray: '5 5' }}
            >
              <Popup>🏫 School zone · {z.name}</Popup>
            </Circle>
          ))}
        {layers.context &&
          HOSPITAL_ZONES.map((z) => (
            <Circle
              key={z.id}
              center={[z.position.lat, z.position.lng]}
              radius={320}
              pathOptions={{ color: '#1d6fa4', fillColor: '#1d6fa4', fillOpacity: 0.12, weight: 2, dashArray: '5 5' }}
            >
              <Popup>🏥 Hospital zone · {z.name}</Popup>
            </Circle>
          ))}

        {layers.infrastructure &&
          defects
            .filter((d) => (layers.pending ? true : d.status !== 'Pending Corroboration'))
            .map((d) => {
              const color =
                d.status === 'Pending Corroboration'
                  ? '#c9a44a'
                  : d.severity === 'critical'
                    ? '#d16a58'
                    : '#3aa88f'
              return (
                <CircleMarker
                  key={d.id}
                  center={[d.position.lat, d.position.lng]}
                  radius={d.status === 'Pending Corroboration' ? 8 : 9}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.9,
                    weight: 2,
                    className: d.severity === 'critical' ? 'pulse-ring' : '',
                  }}
                >
                  <Popup>
                    <strong>{d.type}</strong> · {d.id}
                    <br />
                    {d.location}
                    <br />
                    {d.status} · {d.confidence}% · {d.buses.length} bus(es)
                  </Popup>
                </CircleMarker>
              )
            })}

        {layers.incidents &&
          incidents.map((i) => (
            <CircleMarker
              key={i.id}
              center={[i.position.lat, i.position.lng]}
              radius={10}
              pathOptions={{ color: '#d16a58', fillColor: '#d16a58', fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                <strong>{i.type}</strong> · {i.id}
                <br />
                {i.plate} · ANPR {i.anprConfidence}%
              </Popup>
            </CircleMarker>
          ))}

        {layers.infrastructure &&
          pedestrians.map((p) => (
            <CircleMarker
              key={p.id}
              center={[p.position.lat, p.position.lng]}
              radius={7}
              pathOptions={{ color: '#b7cdf0', fillColor: '#5b8fd4', fillOpacity: 0.9, weight: 2 }}
            >
              <Popup>
                Vulnerable Pedestrian · {p.title}
                <br />
                {p.location} · repeats {p.repeats}
              </Popup>
            </CircleMarker>
          ))}

        {layers.buses &&
          buses.map((b) => (
            <CircleMarker
              key={b.id}
              center={[b.position.lat, b.position.lng]}
              radius={7}
              pathOptions={{
                color: '#fff',
                weight: 2,
                fillColor: b.status === 'ONLINE' ? '#0e7c6e' : b.status === 'OFFLINE' ? '#888' : '#c67c00',
                fillOpacity: 1,
              }}
            >
              <Popup>
                🚌 <strong>{b.id}</strong> · {b.route}<br />
                Status: {b.status} · Cameras: {b.cameraActive}/{b.cameraTotal} · AI: {b.aiOnline ? 'Online' : 'Off'}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  )
}

export const DEFAULT_LAYERS: MapLayers = {
  buses: true,
  infrastructure: true,
  incidents: true,
  traffic: true,
  context: true,
  heatmap: false,
  pending: true,
}
