import { supabase, CATEGORIES } from '@/lib/supabase'
import Link from 'next/link'
import MapWrapper from '@/components/MapWrapper'

export const revalidate = 60

async function getRecentReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('is_valid', true)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching reports:', error)
    return []
  }
  return data || []
}

async function getStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  
  const { count } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo)
    .eq('is_valid', true)
  
  return { reportsLast7Days: count || 0 }
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

export default async function Home() {
  const [reports, stats] = await Promise.all([
    getRecentReports(),
    getStats()
  ])

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold">{stats.reportsLast7Days}</div>
          <div className="text-xs text-zinc-500">Reports (7 days)</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold">—</div>
          <div className="text-xs text-zinc-500">Active clusters</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold">—</div>
          <div className="text-xs text-zinc-500">Countries</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold">—</div>
          <div className="text-xs text-zinc-500">Correlations</div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8">
        <MapWrapper />
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6 mb-8 text-center">
        <h2 className="text-lg font-medium mb-2">Notice something unusual?</h2>
        <p className="text-zinc-400 text-sm mb-4">
          Your observation could help reveal patterns no one person can see alone.
        </p>
        <Link 
          href="/report"
          className="inline-block px-6 py-2 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          Submit a report
        </Link>
      </div>

      {/* Recent reports */}
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <span className="text-zinc-500">◉</span> Recent reports
      </h2>
      
      {reports.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          No reports yet. Be the first to contribute!
        </div>
      ) : (
        <div className="space-y-2">
          {reports.map((report) => (
            <div 
              key={report.id}
              className="bg-zinc-900 rounded-lg p-4 flex gap-4"
            >
              <div className="flex gap-1 text-lg">
                {report.categories.slice(0, 3).map((cat: string) => (
                  <span key={cat}>{getCategoryIcon(cat)}</span>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-300">
                    {report.city || 'Unknown'}{report.country ? `, ${report.country}` : ''}
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">{formatTimeAgo(report.created_at)}</span>
                </div>
                {report.remarks && (
                  <p className="text-sm text-zinc-400 mt-1">
                    {report.remarks}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}