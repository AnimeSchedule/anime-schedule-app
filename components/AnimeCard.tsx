"use client";
import { AnimeItem } from "../lib/api";
import { formatSource } from "../lib/format";

export default function AnimeCard({ anime, onSelect }: { anime: AnimeItem; onSelect: (anime: AnimeItem) => void }) {
  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(anime)}
        aria-label={`View details for ${anime.title_english || anime.title}`}
        className="w-full text-left flex gap-3 sm:gap-4 my-3 sm:my-4 items-start p-3 sm:p-4 rounded-2xl bg-[color:var(--surface-0)] border border-[color:var(--surface-border)] shadow-[0_10px_30px_rgba(5,10,24,0.35)] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300/35 hover:shadow-[0_20px_36px_rgba(7,14,30,0.48)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
      >
        {/* Poster */}
        <div className="relative w-24 sm:w-32 md:w-36 lg:w-44 aspect-2/3 rounded-xl overflow-hidden shrink-0 border border-gray-700/50">
          {anime.poster_url ? (
            <>
              <img
                src={anime.poster_url}
                alt={anime.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.querySelector('.poster-fallback')?.classList.remove('hidden'); }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="poster-fallback hidden absolute inset-0 flex items-center justify-center text-gray-500 font-semibold tracking-wide">
                NO POSTER
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-semibold tracking-wide">
              NO POSTER
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-0 sm:p-2 min-w-0">
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-100 line-clamp-2 tracking-tight">
              {anime.title_english || anime.title}
            </h3>

            {anime.synopsis && (
              <p className="text-xs sm:text-sm text-gray-300/90 mt-1.5 sm:mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {anime.synopsis}
              </p>
            )}

            <div className="mt-2 sm:mt-3 space-y-1.5">
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

            {anime.status && (
              <div className="mt-3 space-y-1">
                {anime.status.total ? (
                  <>
                    <div className="flex justify-between text-xs sm:text-sm text-[color:var(--text-muted)]">
                      <span>Aired</span>
                      <span>
                        {anime.status.aired} / {anime.status.total}
                      </span>
                    </div>

                    <div className="relative w-full h-[3px] bg-slate-700/80 rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-orange-300 rounded-full transition-[width] duration-500"
                        style={{
                          width: `${(anime.status.aired / anime.status.total) * 100}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs sm:text-sm text-[color:var(--text-muted)]">
                      <span>Airing</span>
                      <span>Episode {anime.status.aired}</span>
                    </div>

                    <div className="relative w-full h-[3px] bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-300/70 via-amber-100/40 to-orange-300/70 animate-[pulse_2.2s_ease-in-out_infinite]" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </button>
    </>
  );
}