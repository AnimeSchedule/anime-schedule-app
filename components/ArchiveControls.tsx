"use client";
import { FaSearch, FaThLarge, FaList, FaTimes } from "react-icons/fa";
import classNames from "classnames";
import CustomDropdown from "./CustomDropdown";

export default function ArchiveControls({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  genres,
  selectedStudio,
  onStudioChange,
  studios,
  viewMode,
  onViewModeChange,
  resultCount,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedGenre: string | null;
  onGenreChange: (genre: string | null) => void;
  genres: string[];
  selectedStudio: string | null;
  onStudioChange: (studio: string | null) => void;
  studios: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  resultCount: number;
}) {
  return (
    <div className="mb-8 space-y-4 surface-panel rounded-2xl p-4 sm:p-5 sticky top-12 z-30 before:content-[''] before:absolute before:-top-1 before:left-0 before:right-0 before:h-1 before:bg-[color:var(--bg-0)] before:pointer-events-auto">
      {/* Search Bar - Full width */}
      <div className="relative w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-200/70 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title..."
          aria-label="Search anime by title"
          inputMode="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-600/40 text-gray-100 placeholder-slate-400 focus:outline-none focus:border-orange-300/55 focus-visible:ring-2 focus-visible:ring-orange-300/60 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200 transition-colors rounded-md"
            aria-label="Clear search"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        {/* Filter Dropdowns - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          {/* Genre Filter - Custom Dropdown */}
          <div className="flex-1 sm:flex-none sm:min-w-48">
            <CustomDropdown
              value={selectedGenre}
              onChange={onGenreChange}
              options={genres}
              placeholder="All Genres"
              label="Genre"
              onClear={() => onGenreChange(null)}
            />
          </div>

          {/* Studio Filter - Custom Dropdown */}
          <div className="flex-1 sm:flex-none sm:min-w-48">
            <CustomDropdown
              value={selectedStudio}
              onChange={onStudioChange}
              options={studios}
              placeholder="All Studios"
              label="Studio"
              onClear={() => onStudioChange(null)}
            />
          </div>
        </div>

        {/* View Toggle and Results */}
        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <span className="text-sm text-[color:var(--text-muted)] whitespace-nowrap" role="status" aria-live="polite" aria-atomic="true">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-600/40">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={classNames(
                "p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60",
                viewMode === "grid"
                  ? "bg-orange-300/20 text-orange-100"
                  : "text-[color:var(--text-muted)] hover:text-gray-100"
              )}
              title="Grid view"
              aria-label="Switch to grid view"
            >
              <FaThLarge size={18} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={classNames(
                "p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60",
                viewMode === "list"
                  ? "bg-orange-300/20 text-orange-100"
                  : "text-[color:var(--text-muted)] hover:text-gray-100"
              )}
              title="List view"
              aria-label="Switch to list view"
            >
              <FaList size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
