import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ReferenceTabs } from "@/components/reference-tabs";
import { fetchMetricsFromGitHub, getLastUpdated } from "@/lib/fetch-metrics";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const [metrics, lastUpdated] = await Promise.all([
    fetchMetricsFromGitHub(),
    getLastUpdated(),
  ]);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-theme transition-colors duration-200">
      {/* Header */}
      <header className="relative border-b border-theme backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200 bg-[var(--background-color)]/80">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" className="text-theme" />
            <div className="h-5 w-px bg-[var(--border-color)]" />
            <span className="text-sm font-medium text-theme-muted">
              Analytics SDK Reference
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-theme">
              SDK Metrics Reference
            </h1>
            <p className="text-theme-muted">
              All trackable events and methods available in the Veya Analytics SDK.
            </p>
            {formattedDate && (
              <p className="text-xs text-theme-muted/60">
                Last synced from{" "}
                <a
                  href="https://github.com/adam-3owl/veya-analytics-pkg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                >
                  veya-analytics-pkg
                </a>{" "}
                on {formattedDate}
              </p>
            )}
          </div>

          {/* Reference Tabs */}
          <ReferenceTabs metrics={metrics} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-theme mt-20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-theme-muted">
            Veya Analytics SDK v1.0.0 · Data synced hourly from GitHub
          </p>
        </div>
      </footer>
    </div>
  );
}
