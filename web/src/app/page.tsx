import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="container flex max-w-4xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-bold tracking-tight text-primary">
            Cloudy
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            A social platform for natural and low-intervention wine enthusiasts
          </p>
        </div>

        {/* Features */}
        <div className="grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 text-lg font-semibold">Track & Discover</h3>
            <p className="text-sm text-muted-foreground">
              Log your wine experiences and discover new natural wines from around the world
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 text-lg font-semibold">Full Transparency</h3>
            <p className="text-sm text-muted-foreground">
              See detailed production information from vineyard to bottle
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 text-left">
            <h3 className="mb-2 text-lg font-semibold">Join the Community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with fellow natural wine enthusiasts and share your journey
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign In
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg bg-muted p-6 text-left">
          <h3 className="mb-2 font-semibold">What makes natural wine special?</h3>
          <p className="text-sm text-muted-foreground">
            Natural wines are made with minimal intervention, organic or biodynamic farming,
            spontaneous fermentation, and little to no added sulfites. They represent a
            philosophy of winemaking that prioritizes authenticity, terroir, and sustainability.
          </p>
        </div>
      </main>
    </div>
  );
}
