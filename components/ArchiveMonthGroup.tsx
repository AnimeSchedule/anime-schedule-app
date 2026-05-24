"use client";
import { ArchiveItem } from "../lib/api";
import { motion } from "framer-motion";
import HorizontalScroller from "./HorizontalScroller";

function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function ArchiveMonthGroup({
  monthKey,
  items,
  onAnimeClick,
}: {
  monthKey: string;
  items: ArchiveItem[];
  onAnimeClick: (anime: ArchiveItem) => void;
}) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-10 overflow-visible"
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-4">
        {formatMonthYear(monthKey)}
      </h2>

      <HorizontalScroller>
        {items.map((anime) => (
          <motion.button
            key={`${anime.id}-${anime.title}-${Math.random().toString(36).slice(2, 8)}`}
            variants={itemVariants}
            onClick={() => onAnimeClick(anime)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="relative z-10 group shrink-0 w-40 sm:w-44 md:w-48 lg:w-56 snap-center aspect-2/3 rounded-lg overflow-hidden border border-gray-700/50 shadow-lg cursor-pointer transition-shadow duration-300 hover:shadow-2xl lg:hover:z-40"
          >
            {/* Poster Image */}
            {anime.poster_url ? (
              <img
                src={anime.poster_url}
                alt={anime.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-semibold tracking-wide bg-gray-800">
                NO POSTER
              </div>
            )}

            {/* Mobile: Always visible title + score (below lg breakpoint) */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90 flex flex-col justify-end p-3 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300">
              <p className="text-white font-bold text-sm line-clamp-2">
                {anime.title_english || anime.title}
              </p>
              {anime.score && (
                <p className="text-yellow-300 text-xs mt-1 flex items-center gap-1">
                  ⭐ {anime.score}
                </p>
              )}
            </div>

            {/* Desktop: Hover overlay only (lg and above) */}
            <div className="hidden lg:flex absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-3">
              <p className="text-white font-bold text-sm line-clamp-2">
                {anime.title_english || anime.title}
              </p>
              {anime.score && (
                <p className="text-yellow-300 text-xs mt-1 flex items-center gap-1">
                  ⭐ {anime.score}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </HorizontalScroller>
    </motion.div>
  );
}
