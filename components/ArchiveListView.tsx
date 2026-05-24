"use client";
import { ArchiveItem } from "../lib/api";
import { formatSource } from "../lib/format";
import { motion } from "framer-motion";

function formatMonthYear(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export default function ArchiveListView({
  items,
  groupedByMonth,
  onAnimeClick,
}: {
  items: ArchiveItem[];
  groupedByMonth: { monthKey: string; items: ArchiveItem[] }[];
  onAnimeClick: (anime: ArchiveItem) => void;
}) {
  return (
    <div className="space-y-8">
      {groupedByMonth.map(({ monthKey, items: monthItems }) => (
        <div key={monthKey}>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            {formatMonthYear(monthKey)}
          </h2>

          <div className="space-y-3">
            {monthItems.map((anime) => (
              <motion.button
                key={anime.id}
                onClick={() => onAnimeClick(anime)}
                whileHover={{ x: 4 }}
                className="w-full text-left p-4 rounded-lg bg-gray-900/40 border border-gray-800 hover:border-indigo-600 transition-all duration-300 cursor-pointer hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Poster */}
                  <div className="w-20 h-28 sm:w-24 sm:h-36 shrink-0 rounded-lg overflow-hidden border border-gray-700/50">
                    {anime.poster_url ? (
                      <img
                        src={anime.poster_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-semibold bg-gray-800">
                        NO POSTER
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                      {anime.title_english || anime.title}
                    </h3>

                    {anime.synopsis && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {anime.synopsis}
                      </p>
                    )}

                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {anime.score && (
                        <span className="text-yellow-300 font-semibold bg-yellow-900/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                          ⭐ {anime.score}
                        </span>
                      )}
                      {anime.genres && (
                        <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded text-xs">
                          {anime.genres}
                        </span>
                      )}
                      {anime.studios && (
                        <span className="bg-green-900/30 text-green-300 px-2 py-1 rounded text-xs">
                          {anime.studios}
                        </span>
                      )}
                      {anime.source && (
                        <span className="bg-pink-900/30 text-pink-300 px-2 py-1 rounded text-xs">
                          {formatSource(anime.source)}
                        </span>
                      )}
                    </div>

                    {/* Date Range */}
                    <p className="text-xs text-gray-500">
                      Aired: {new Date(anime.end_date).toLocaleDateString()} •{" "}
                      {anime.num_episodes} episode{anime.num_episodes !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
