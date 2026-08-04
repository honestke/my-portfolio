"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, ListTree } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectsGrid } from "./ProjectsGrid";
import { Timeline, type TimelineEntry } from "./Timeline";

export function FilterableProjects({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState<"grid" | "timeline">("grid");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [projects],
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [projects, query, category]);

  const timelineEntries: TimelineEntry[] = filtered.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.category ?? "Project",
    dateRange: p.project_date
      ? new Date(p.project_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })
      : "—",
    description: p.description,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {(projects.length > 3 || categories.length > 1) && (
          <>
            <div className="relative flex-1">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 outline-none focus:border-emerald dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              />
            </div>
            {categories.length > 1 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-emerald dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        <div className="flex shrink-0 gap-1 rounded-md border border-neutral-300 p-1 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`rounded p-1.5 transition ${view === "grid" ? "bg-emerald text-black" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            type="button"
            onClick={() => setView("timeline")}
            aria-label="Timeline view"
            className={`rounded p-1.5 transition ${view === "timeline" ? "bg-emerald text-black" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}
          >
            <ListTree size={14} />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-sm text-neutral-500">No projects match your search.</p>
        </div>
      ) : view === "grid" ? (
        <ProjectsGrid projects={filtered} />
      ) : (
        <Timeline entries={timelineEntries} />
      )}
    </div>
  );
}
