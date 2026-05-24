"use client";
import { useState, useMemo } from "react";
import { ArchiveItem } from "../lib/api";
import ArchiveControls from "./ArchiveControls";
import ArchiveMonthGroup from "./ArchiveMonthGroup";
import ArchiveListView from "./ArchiveListView";
import AnimeModal from "./AnimeModal";
import { AnimatePresence } from "framer-motion";

export default function ArchiveContent({ archive }: { archive: ArchiveItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAnime, setSelectedAnime] = useState<ArchiveItem | null>(null);

  // Extract unique genres and studios
  const allGenres = useMemo(() => {
    const genresSet = new Set<string>();
    archive.forEach((item) => {
      if (item.genres) {
        item.genres.split(",").forEach((g) => genresSet.add(g.trim()));
      }
    });
    return Array.from(genresSet).sort();
  }, [archive]);

  const allStudios = useMemo(() => {
    const studiosSet = new Set<string>();
    archive.forEach((item) => {
      if (item.studios) {
        item.studios.split(",").forEach((s) => studiosSet.add(s.trim()));
      }
    });
    return Array.from(studiosSet).sort();
  }, [archive]);

  // Filter archive based on search and filters
  const filteredArchive = useMemo(() => {
    return archive.filter((item) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(term);
        const titleEnMatch = item.title_english?.toLowerCase().includes(term);
        if (!titleMatch && !titleEnMatch) return false;
      }

      // Genre filter
      if (selectedGenre) {
        if (!item.genres?.includes(selectedGenre)) return false;
      }

      // Studio filter
      if (selectedStudio) {
        if (!item.studios?.includes(selectedStudio)) return false;
      }

      return true;
    });
  }, [archive, searchTerm, selectedGenre, selectedStudio]);

  // Group by month and sort
  const groupedByMonth = useMemo(() => {
    const groups: { [key: string]: ArchiveItem[] } = {};

    filteredArchive.forEach((item) => {
      // Parse end_date (format: YYYY-MM-DD)
      const date = new Date(item.end_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(item);
    });

    // Sort each month by end_date descending, and sort months by newest first
    Object.keys(groups).forEach((monthKey) => {
      groups[monthKey].sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    });

    // Return sorted by month (newest first)
    return Object.keys(groups)
      .sort()
      .reverse()
      .map((monthKey) => ({
        monthKey,
        items: groups[monthKey],
      }));
  }, [filteredArchive]);

  return (
    <div className="w-full">
      <ArchiveControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        genres={allGenres}
        selectedStudio={selectedStudio}
        onStudioChange={setSelectedStudio}
        studios={allStudios}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={filteredArchive.length}
      />

      {filteredArchive.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 text-lg">No anime found matching your filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="space-y-12">
          {groupedByMonth.map(({ monthKey, items }) => (
            <ArchiveMonthGroup
              key={monthKey}
              monthKey={monthKey}
              items={items}
              onAnimeClick={setSelectedAnime}
            />
          ))}
        </div>
      ) : (
        <ArchiveListView
          items={filteredArchive}
          groupedByMonth={groupedByMonth}
          onAnimeClick={setSelectedAnime}
        />
      )}

      <AnimatePresence>
        {selectedAnime && (
          <AnimeModal
            initial={selectedAnime}
            onClose={() => setSelectedAnime(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
