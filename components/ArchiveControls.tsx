"use client";
import { FaSearch, FaThLarge, FaList } from "react-icons/fa";
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
    <div className="mb-8 space-y-4">
      {/* Search Bar - Full width */}
      <div className="relative w-full">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800/40 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
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
          <span className="text-sm text-gray-400 whitespace-nowrap">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2 bg-gray-800/40 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => onViewModeChange("grid")}
              className={classNames(
                "p-2 rounded transition-colors",
                viewMode === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              )}
              title="Grid view"
            >
              <FaThLarge size={18} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={classNames(
                "p-2 rounded transition-colors",
                viewMode === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              )}
              title="List view"
            >
              <FaList size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
