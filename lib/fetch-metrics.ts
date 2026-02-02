import { Metric, MetricCategory, metrics as staticMetrics } from "@/types/metrics";

const GITHUB_API_URL =
  "https://api.github.com/repos/adam-3owl/veya-analytics-pkg/readme";

function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3.raw",
  };

  // Use GITHUB_TOKEN env var for private repo access
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

// Map README categories to our MetricCategory type
const categoryMap: Record<string, MetricCategory> = {
  navigation: "navigation",
  catalog: "menu",
  cart: "ecommerce",
  checkout: "ecommerce",
  auth: "authentication",
  location: "location",
  engagement: "search",
  loyalty: "loyalty",
  promotion: "loyalty",
  error: "error",
};

function parseEventTaxonomyTable(markdown: string): Metric[] {
  // Find the Event Taxonomy section and extract the table
  const taxonomyMatch = markdown.match(
    /## Event Taxonomy[\s\S]*?### Standard Events[\s\S]*?\| Event Name \| Category \| Description \| Key Properties \|[\s\S]*?\|([\s\S]*?)(?=\n###|\n---|\n## |$)/
  );

  if (!taxonomyMatch) {
    console.warn("Could not find Event Taxonomy table in README");
    return [];
  }

  const tableContent = taxonomyMatch[1];
  const rows = tableContent
    .split("\n")
    .filter((line) => line.trim().startsWith("|") && !line.includes("---"));

  const metrics: Metric[] = [];

  for (const row of rows) {
    const cells = row
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    if (cells.length >= 4) {
      const eventName = cells[0].replace(/`/g, "");
      const readmeCategory = cells[1].toLowerCase();
      const description = cells[2];
      const keyProperties = cells[3];

      // Map the README category to our category
      const category = categoryMap[readmeCategory] || "navigation";

      // Try to find method from our static metrics or generate a placeholder
      const staticMetric = staticMetrics.find((m) => m.name === eventName);

      metrics.push({
        name: eventName,
        method: staticMetric?.method || `track('${eventName}', {...})`,
        category,
        description,
        parameters: keyProperties !== "-" ? keyProperties : undefined,
      });
    }
  }

  return metrics;
}

export async function fetchMetricsFromGitHub(): Promise<Metric[]> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch README: ${response.status}`);
    }

    const markdown = await response.text();
    const parsedMetrics = parseEventTaxonomyTable(markdown);

    if (parsedMetrics.length === 0) {
      console.warn("No metrics parsed from README, falling back to static metrics");
      return staticMetrics;
    }

    // Merge with static metrics to get complete method signatures
    // The README has summary info, our static file has detailed method signatures
    const mergedMetrics = parsedMetrics.map((parsed) => {
      const staticMatch = staticMetrics.find((s) => s.name === parsed.name);
      if (staticMatch) {
        return {
          ...parsed,
          method: staticMatch.method,
          parameters: staticMatch.parameters || parsed.parameters,
        };
      }
      return parsed;
    });

    // Add any static metrics not in the README (for completeness)
    const parsedNames = new Set(parsedMetrics.map((m) => m.name));
    const additionalMetrics = staticMetrics.filter((m) => !parsedNames.has(m.name));

    return [...mergedMetrics, ...additionalMetrics];
  } catch (error) {
    console.error("Error fetching metrics from GitHub:", error);
    return staticMetrics;
  }
}

export async function getLastUpdated(): Promise<string | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/repos/adam-3owl/veya-analytics-pkg/commits?path=README.md&per_page=1",
      {
        next: { revalidate: 3600 },
        headers,
      }
    );

    if (!response.ok) return null;

    const commits = await response.json();
    if (commits.length > 0) {
      return commits[0].commit.committer.date;
    }
    return null;
  } catch {
    return null;
  }
}
