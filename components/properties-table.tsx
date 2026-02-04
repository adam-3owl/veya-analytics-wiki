"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  scopeLabels,
  scopeColors,
  PropertyScope,
  Property,
} from "@/types/properties";
import { cn } from "@/lib/utils";

const allScopes = Object.keys(scopeLabels) as PropertyScope[];

interface PropertiesTableProps {
  properties: Property[];
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<PropertyScope[]>([]);

  const toggleScope = (scope: PropertyScope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedScopes([]);
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        searchQuery === "" ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesScope =
        selectedScopes.length === 0 ||
        selectedScopes.includes(property.scope);

      return matchesSearch && matchesScope;
    });
  }, [properties, searchQuery, selectedScopes]);

  const hasActiveFilters = searchQuery !== "" || selectedScopes.length > 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Scope Filters */}
        <div className="flex flex-wrap gap-2">
          {allScopes.map((scope) => (
            <button
              key={scope}
              onClick={() => toggleScope(scope)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                selectedScopes.includes(scope)
                  ? scopeColors[scope]
                  : "bg-transparent text-theme-muted border-[var(--border-color)] hover:border-[var(--border-color-hover)]"
              )}
            >
              {scopeLabels[scope]}
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
        Showing {filteredProperties.length} of {properties.length} properties
      </div>

      {/* Table */}
      <div className="border border-theme rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme bg-[var(--muted-color)]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Property Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Scope
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Platforms
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-theme-muted uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredProperties.map((property, index) => (
                <tr
                  key={`${property.name}-${index}`}
                  className="hover:bg-[var(--muted-color)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-theme bg-[var(--muted-color)] px-1.5 py-0.5 rounded">
                      {property.name}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono text-emerald-400">
                      {property.type}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        scopeColors[property.scope]
                      )}
                    >
                      {scopeLabels[property.scope]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-theme-muted whitespace-nowrap">
                    {property.source}
                  </td>
                  <td className="px-4 py-3 text-sm text-theme-muted whitespace-nowrap">
                    {property.platforms}
                  </td>
                  <td className="px-4 py-3 text-sm text-theme-muted max-w-md">
                    {property.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-theme-muted">No properties match your filters.</p>
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
