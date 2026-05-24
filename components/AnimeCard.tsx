"use client";
import { useState } from "react";
import { AnimeItem } from "../lib/api";
import { formatSource } from "../lib/format";
import { AnimatePresence } from "framer-motion";
import AnimeModal from "./AnimeModal";

export default function AnimeCard({ anime }: { anime: AnimeItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex flex-col sm:flex-row my-4 items-start gap-4 p-4 rounded-2xl backdrop-blur-md bg-gray-900/40 border border-gray-800 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      >
        {/* Poster */}
        <div className="relative w-full sm:w-32 md:w-36 lg:w-44 aspect-2/3 rounded-xl overflow-hidden shrink-0 border border-gray-700/50">
          {anime.poster_url ? (
            <img
              src={anime.poster_url}
              alt={anime.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-semibold tracking-wide">
              NO POSTER
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-2">
          <div>
            <h3 className="text-xl font-bold text-gray-100">
              {anime.title_english || anime.title}
            </h3>

            {anime.synopsis && (
              <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                {anime.synopsis}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {anime.score && (
                <span className="text-yellow-300 font-semibold bg-yellow-900/30 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                  ⭐ {anime.score}
                </span>
              )}
              {anime.genres && (
                <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded-lg text-sm">
                  {anime.genres}
                </span>
              )}
              {anime.studios && (
                <span className="bg-green-900/30 text-green-300 px-2 py-1 rounded-lg text-sm">
                  {anime.studios}
                </span>
              )}
              {anime.source && (
                <span className="bg-pink-900/30 text-pink-300 px-2 py-1 rounded-lg text-sm">
                  {formatSource(anime.source)}
                </span>
              )}
            </div>

            {anime.status && (
              <div className="mt-3 space-y-1">
                {anime.status.total ? (
                  <>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Aired</span>
                      <span>
                        {anime.status.aired} / {anime.status.total}
                      </span>
                    </div>

                    <div className="relative w-full h-[3px] bg-gray-700 rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-400 rounded-full transition-[width] duration-500"
                        style={{
                          width: `${(anime.status.aired / anime.status.total) * 100}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Airing</span>
                      <span>Episode {anime.status.aired}</span>
                    </div>

                    <div className="relative w-full h-[3px] bg-gray-700/50 rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/70 via-indigo-200/40 to-indigo-400/70 animate-[pulse_2.2s_ease-in-out_infinite]" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <a
            href={anime.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 self-start px-3 py-1.5 text-sm font-medium text-indigo-300 bg-indigo-900/20 rounded-md hover:bg-indigo-900/40 transition-colors"
          >
            View on MAL
          </a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && <AnimeModal initial={anime} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}