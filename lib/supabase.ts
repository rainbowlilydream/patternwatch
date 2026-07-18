import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our tables
export type Report = {
  id: string
  created_at: string
  lat: number
  lon: number
  city: string | null
  country: string | null
  categories: string[]
  remarks: string | null
  source: string
}

export type Cluster = {
  id: string
  created_at: string
  updated_at: string
  center_lat: number
  center_lon: number
  radius_km: number
  region_name: string | null
  report_count: number
  first_report_at: string | null
  last_report_at: string | null
  category_counts: Record<string, number>
  status: 'active' | 'growing' | 'stable' | 'declining' | 'resolved'
  risk_level: 'low' | 'medium' | 'elevated' | 'high'
}

// Category definitions
export const CATEGORIES = [
  { id: 'pet_animal', label: 'Pet/animal weird', icon: '🐕' },
  { id: 'dreams', label: 'Unusual dream', icon: '😴' },
  { id: 'home_structural', label: 'Home/structural', icon: '🏠' },
  { id: 'body_sensations', label: 'Body feels off', icon: '😵' },
  { id: 'electronics', label: 'Tech glitchy', icon: '📱' },
  { id: 'water_well', label: 'Water/well odd', icon: '💧' },
  { id: 'just_feeling', label: 'Just a feeling', icon: '🌀' },
  { id: 'all_good', label: 'All good today', icon: '✨' },
  { id: 'other', label: 'Other', icon: '❓' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']