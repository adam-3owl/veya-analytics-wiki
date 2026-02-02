"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  categoryLabels,
  categoryColors,
  MetricCategory,
  Metric,
} from "@/types/metrics";
import { cn } from "@/lib/utils";

const allCategories = Object.keys(categoryLabels) as MetricCategory[];

interface MetricsTableProps {
  metrics: Metric[];
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<MetricCategory[]>([]);

  const toggleCategory = (category: MetricCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
  };

  const filteredMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      const matchesSearch =
        searchQuery === "" ||
        metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(metric.category);

      return matchesSearch && matchesCategory;
    });
  }, [metrics, searchQuery, selectedCategories]);

  const hasActiveFilters = searchQuery !== "" || selectedCategories.length > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
          <Input
            type="text"
            placeholder="Search metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                selectedCategories.includes(category)
                  ? categoryColors[category]
                  : "bg-transparent text-theme-muted border-[var(--border-color)] hover:border-[var(--border-color-hover)]"
              )}
            >
              {categoryLabels[category]}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--border-color)] text-theme-muted hover:text-theme hover:border-[var(--border-color-hover)] transition-all flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-theme-muted">
        Showing {filteredMetrics.length} of {metrics.length} metrics
      </div>

      {/* Table */}
      <div className="border border-theme rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme bg-[var(--muted-color)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredMetrics.map((metric, index) => (
                <tr
                  key={`${metric.name}-${index}`}
                  className="hover:bg-[var(--muted-color)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-theme bg-[var(--muted-color)] px-1.5 py-0.5 rounded">
                      {metric.name}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-emerald-400">
                      {metric.method}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        categoryColors[metric.category]
                      )}
                    >
                      {categoryLabels[metric.category]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-theme-muted max-w-md">
                    <p>{metric.description}</p>
                    {metric.parameters && (
                      <p className="mt-1 text-xs text-theme-muted/70">
                        <span className="font-medium">Params:</span>{" "}
                        <code className="font-mono">{metric.parameters}</code>
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredMetrics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-theme-muted">No metrics match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
