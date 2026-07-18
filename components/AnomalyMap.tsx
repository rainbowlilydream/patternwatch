'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { supabase, CATEGORIES, Report } from '@/lib/supabase'
import 'leaflet/dist/leaflet.css'

const categoryColors: Record<string, string> = {
  pet_animal: '#a855f7',    // purple
  dreams: '#6366f1',        // indigo
  home_structural: '#f97316', // orange
  body_sensations: '#ef4444', // red
  electronics: '#3b82f6',    // blue
  water_well: '#06b6d4',     // cyan
  just_feeling: '#8b5cf6',   // violet
  all_good: '#22c55e',       // green
  other: '#71717a',          // gray
}

function getCategoryIcon(categoryId: string) {
  return CATEGORIES.find(c => c.id === categoryId)?.icon || '❓'
}

function formatTimeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function AnomalyMap() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('is_valid', true)
        .order('created_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setReports(data)
      }
      setLoading(false)
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-zinc-900 rounded-lg flex items-center justify-center">
        <span className="text-zinc-500">Loading map...</span>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-zinc-800">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', background: '#18181b' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {reports.map((report) => {
          const primaryCategory = report.categories[0] || 'other'
          const color = categoryColors[primaryCategory] || '#71717a'
          
          return (
            <CircleMarker
              key={report.id}
              center={[report.lat, report.lon]}
              radius={8}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-zinc-900 min-w-[150px]">
                  <div className="font-medium mb-1">
                    {report.categories.map(c => getCategoryIcon(c)).join(' ')}
                  </div>
                  <div className="text-sm text-zinc-600 mb-1">
                    {report.city || 'Unknown'}{report.country ? `, ${report.country}` : ''}
                  </div>
                  <div className="text-xs text-zinc-500 mb-2">
                    {formatTimeAgo(report.created_at)}
                  </div>
                  {report.remarks && (
                    <div className="text-sm text-zinc-700 border-t pt-2">
                      {report.remarks}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}