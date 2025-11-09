export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="container flex max-w-4xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-bold tracking-tight text-primary">
            Map View
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Interactive map to discover natural wines, producers, and venues worldwide
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8 text-left">
          <h3 className="mb-4 text-lg font-semibold">Coming Soon</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Interactive Mapbox GL map with pan and zoom</li>
            <li>• Smart clustering for performance at any zoom level</li>
            <li>• Filter by producers, wine bars, restaurants, and shops</li>
            <li>• Search for specific locations and venues</li>
            <li>• Detailed popups with venue information and ratings</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
