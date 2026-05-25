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
          <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">
            {formatMonthYear(monthKey)}
          </h2>

          <div className="space-y-3">
            {monthItems.map((anime, index) => (
              <motion.button
                key={`${anime.id}-${index}`}
                onClick={() => onAnimeClick(anime)}
                whileHover={{ x: 4 }}
                className="w-full text-left p-4 rounded-xl bg-[color:var(--surface-0)] border border-[color:var(--surface-border)] hover:border-orange-300/35 transition-all duration-300 cursor-pointer hover:shadow-[0_16px_30px_rgba(7,14,28,0.42)]"
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
                      <div className="w-full h-full flex items-center justify-center text-[color:var(--text-muted)] text-xs font-semibold bg-slate-900">
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
                      <p className="text-sm text-[color:var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">
                        {anime.synopsis}
                      </p>
                    )}

                    <div className="mb-3 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
                        <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/30 bg-amber-400/14 px-2 py-0.5 text-amber-200 font-semibold">
                          ⭐ {anime.score ?? "N/A"}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300/25 bg-emerald-400/12 px-2 py-0.5 text-emerald-100 max-w-full">
                          <span className="text-emerald-200/80 font-semibold">Studio:</span>
                          <span className="line-clamp-1">{anime.studios || "Unknown"}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md border border-orange-300/25 bg-orange-400/12 px-2 py-0.5 text-orange-100 max-w-full">
                          <span className="text-orange-200/80 font-semibold">Source:</span>
                          <span className="line-clamp-1">{anime.source ? formatSource(anime.source) : "Unknown"}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {(anime.genres ? anime.genres.split(", ") : ["Unknown"]).map((genre) => (
                          <span
                            key={genre}
                            className="bg-teal-300/12 text-teal-100 border border-teal-200/20 px-2 py-0.5 rounded-md text-[10px] sm:text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <p className="text-xs text-[color:var(--text-muted)]">
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
