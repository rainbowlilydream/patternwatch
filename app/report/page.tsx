'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, CATEGORIES } from '@/lib/supabase'

export default function ReportPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'getting' | 'got' | 'error'>('idle')
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  const toggleCategory = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('getting')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Round to ~1km precision for privacy (city-level)
        setLocation({
          lat: Math.round(position.coords.latitude * 100) / 100,
          lon: Math.round(position.coords.longitude * 100) / 100
        })
        setLocationStatus('got')
      },
      (error) => {
        console.error('Location error:', error)
        setLocationStatus('error')
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert('Please select at least one option')
      return
    }

    if (!location) {
      alert('Please allow location access')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('reports').insert({
        lat: location.lat,
        lon: location.lon,
        categories: selected,
        remarks: remarks.trim() || null,
        source: 'web'
      })

      if (error) throw error

      router.push('/?submitted=true')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-2">Report an anomaly</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Something seem off? Log it. Takes 10 seconds.
      </p>

      {/* Categories */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`p-3 rounded-lg border text-center transition-colors ${
              selected.includes(cat.id)
                ? 'bg-purple-500/20 border-purple-500/50'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div className="text-xs text-zinc-400">{cat.label}</div>
          </button>
        ))}
      </div>

      {/* Remarks */}
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add details (optional)&#10;&#10;Example: TV mount fell off wall for no reason. 3rd floor apartment."
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm resize-none h-24 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
      />

      {/* Location */}
      <div className="mt-4 mb-6">
        {locationStatus === 'idle' && (
          <button
            onClick={getLocation}
            className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:border-zinc-700 transition-colors"
          >
            📍 Allow location (city-level only)
          </button>
        )}
        {locationStatus === 'getting' && (
          <div className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-500 text-center">
            Getting location...
          </div>
        )}
        {locationStatus === 'got' && location && (
          <div className="w-full p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 text-center">
            ✓ Location captured (rounded to ~1km for privacy)
          </div>
        )}
        {locationStatus === 'error' && (
          <button
            onClick={getLocation}
            className="w-full p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400"
          >
            Location failed — tap to retry
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selected.length === 0 || !location}
        className="w-full p-3 bg-white text-zinc-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit report'}
      </button>

      {/* Privacy note */}
      <p className="text-xs text-zinc-600 text-center mt-4">
        🔒 Location is city-level only. No personal data stored. All data is public.
      </p>
    </div>
  )
}