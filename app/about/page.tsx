export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">What is PatternWatch?</h1>
      
      <div className="space-y-6 text-zinc-300">
        <p>
          Before earthquakes and other major events, people often notice small things: 
          a pet acting strange, an unusual dream, something feeling "off."
        </p>
        
        <p>
          These observations are usually forgotten — until after something happens. 
          Then scientists ask "did you notice anything?" But by then, memory is unreliable 
          and confirmation bias takes over.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-8">
          <p className="text-purple-400 font-medium mb-2">The key insight:</p>
          <p className="text-zinc-400">
            PatternWatch collects observations <span className="text-white">continuously, BEFORE</span> anyone 
            knows an event is coming. When something happens, we can look back at what was 
            logged in the days before — with clean, unbiased, timestamped data.
          </p>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">How it works</h2>
        
        <div className="grid gap-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">1</div>
            <div>
              <p className="font-medium">Report what you notice</p>
              <p className="text-sm text-zinc-500">Takes 10 seconds. Pet weird? Dream vivid? Something feel off? Log it.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">2</div>
            <div>
              <p className="font-medium">We timestamp and map it</p>
              <p className="text-sm text-zinc-500">City-level location only. No personal data stored.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">3</div>
            <div>
              <p className="font-medium">Patterns emerge</p>
              <p className="text-sm text-zinc-500">When many people report similar things in the same area, we detect clusters.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm shrink-0">4</div>
            <div>
              <p className="font-medium">After events, we correlate</p>
              <p className="text-sm text-zinc-500">What was logged before the earthquake? Before the volcanic activity? We check.</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">What we're NOT</h2>
        
        <ul className="space-y-2 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-red-400">✕</span>
            We don't make predictions
          </li>
          <li className="flex gap-2">
            <span className="text-red-400">✕</span>
            We don't tell you an earthquake is coming
          </li>
          <li className="flex gap-2">
            <span className="text-red-400">✕</span>
            We don't sell your data
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4">What we ARE</h2>
        
        <ul className="space-y-2 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-green-400">✓</span>
            Open data for anyone to analyze
          </li>
          <li className="flex gap-2">
            <span className="text-green-400">✓</span>
            Transparent algorithms you can verify
          </li>
          <li className="flex gap-2">
            <span className="text-green-400">✓</span>
            Public infrastructure, not a business
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4">Why "all good" matters</h2>
        
        <p>
          When you report a normal day, you're creating baseline data. Science needs to 
          know what "normal" looks like to spot what's abnormal. Your boring Tuesday is 
          valuable data.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4">Privacy</h2>
        
        <ul className="space-y-2 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-zinc-600">•</span>
            Location is city-level only (not your address)
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600">•</span>
            No account required
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600">•</span>
            No personal data stored
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600">•</span>
            All code is open source
          </li>
        </ul>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mt-10 text-center">
          <p className="text-zinc-500 mb-4">
            PatternWatch is a <a href="https://rainbowlilystudio.com" className="text-purple-400 hover:underline">Rainbow Lily Studio</a> project.
          </p>
          <p className="text-zinc-600 text-sm">
            Open source · No profit · Public data
          </p>
        </div>
      </div>
    </div>
  )
}