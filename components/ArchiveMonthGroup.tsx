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
      initial={false}
      animate="visible"
      className="mb-10 overflow-visible"
    >
      <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">
        {`${formatMonthYear(monthKey)} ${items.length > 0 ? `(${items.length})` : ""}`}
      </h2>

      <HorizontalScroller>
        {items.map((anime, index) => (
          <motion.button
            key={`${anime.id}-${index}`}
            variants={itemVariants}
            onClick={() => onAnimeClick(anime)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="relative z-10 group shrink-0 w-40 sm:w-44 md:w-48 lg:w-56 snap-center aspect-2/3 rounded-xl overflow-hidden border border-slate-600/45 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-orange-200/35 hover:shadow-[0_18px_32px_rgba(5,12,26,0.45)] lg:hover:z-40"
          >
            {/* Poster Image */}
            {anime.poster_url ? (
              <img
                src={anime.poster_url}
                alt={anime.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[color:var(--text-muted)] font-semibold tracking-wide bg-slate-900">
                NO POSTER
              </div>
            )}

            {/* Mobile: Always visible title + score (below lg breakpoint) */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/90 flex flex-col justify-end p-3 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300">
              <p className="text-white font-bold text-sm line-clamp-2">
                {anime.title_english || anime.title}
              </p>
              {anime.score && (
                <p className="text-amber-200 text-xs mt-1 flex items-center gap-1">
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
