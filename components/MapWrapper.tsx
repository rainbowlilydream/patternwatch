'use client'

import dynamic from 'next/dynamic'

const AnomalyMap = dynamic(() => import('./AnomalyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <span className="text-zinc-500">Loading map...</span>
    </div>
  )
})

export default function MapWrapper() {
  return <AnomalyMap />
}