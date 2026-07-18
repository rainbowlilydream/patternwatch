'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, CATEGORIES } from '@/lib/supabase'

async function geocodeLocation(query: string): Promise<{ lat: number; lon: number; city: string; country: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      {
        headers: {
          'User-Agent': 'PatternWatch/1.0'
        }
      }
    )
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      // Round to ~1km precision
      const lat = Math.round(parseFloat(result.lat) * 100) / 100
      const lon = Math.round(parseFloat(result.lon) * 100) / 100
      
      // Parse display name for city/country
      const parts = result.display_name.split(', ')
      const city = parts[0] || query
      const country = parts[parts.length - 1] || ''
      
      return { lat, lon, city, country }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

export default function ReportPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [remarks, setRemarks] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleCategory = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert('Please select at least one option')
      return
    }

    if (!location.trim()) {
      alert('Please enter your city')
      return
    }

    setLoading(true)

    try {
      // Geocode the location
      const geo = await geocodeLocation(location)
      
      if (!geo) {
        alert('Could not find that location. Try "City, Country" format.')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('reports').insert({
        lat: geo.lat,
        lon: geo.lon,
        city: geo.city,
        country: geo.country,
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
        placeholder="Add details (optional)&#10;&#10;Example: Dog was restless all evening, kept barking at nothing."
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm resize-none h-24 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
      />

      {/* Location */}
      <div className="mt-4 mb-6">
        <label className="block text-sm text-zinc-400 mb-2">
          📍 Where are you?
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country (e.g., Tokyo, Japan)"
          className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
        />
        <p className="text-xs text-zinc-600 mt-1">
          Rounded to city center — we don't store exact addresses
        </p>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || selected.length === 0 || !location.trim()}
        className="w-full p-3 bg-white text-zinc-900 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit report'}
      </button>

      {/* Privacy note */}
      <p className="text-xs text-zinc-600 text-center mt-4">
        🔒 Location rounded to ~1km. No personal data. All reports are public.
      </p>
    </div>
  )
}