"use client";
import { useEffect, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBox,
  FaFilm,
  FaDownload,
  FaRegCalendarAlt,
  FaMagnet,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { AnimeItem } from "../lib/api";
import { formatSource } from "../lib/format";
import { motion, AnimatePresence } from "framer-motion";
import useNyaa from "../hooks/useNyaa";

function cleanSearchTerm(term: string) {
  return term.replace(/['":]/g, "");
}

const SEARCH_PROFILES = [
  {
    label: "VARYG Dual Audio",
    pattern: (title: string, titleEn?: string) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `VARYG DUAL 1080p ("${t}"|"${te}")` : `VARYG DUAL 1080p ${t}`;
    },
  },
  {
    label: "Yameii Dual Audio",
    pattern: (title: string, titleEn?: string) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `Yameii 1080p ("${t}"|"${te}")` : `Yameii 1080p ${t}`;
    },
  },
  {
    label: "Dub 1080p",
    pattern: (title: string, titleEn?: string) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `Dub 1080p ("${t}"|"${te}")` : `Dub 1080p ${t}`;
    },
  },
];

export default function AnimeModal({
  initial,
  onClose,
}: {
  initial: AnimeItem;
  onClose: () => void;
}) {
  const queries = SEARCH_PROFILES.map((p) =>
    p.pattern(initial.title, initial.title_english)
  );
  const [queryIndex, setQueryIndex] = useState(0);
  const [manualProfileOverride, setManualProfileOverride] = useState(false);
  const searchQuery = queries[queryIndex];
  const { data: nyaaData, loading, error } = useNyaa(
    searchQuery,
    initial.id
  );
  const [hasExhaustedQueries, setHasExhaustedQueries] = useState(false);

  useEffect(() => {
    if (manualProfileOverride) return;
    if (loading || error) return;
    if (nyaaData?.torrents?.length === 0 && queryIndex < queries.length - 1) {
      setQueryIndex(queryIndex + 1);
      setHasExhaustedQueries(false);
      return;
    }
    if (nyaaData?.torrents?.length === 0 && queryIndex === queries.length - 1) {
      setHasExhaustedQueries(true);
    }
  }, [manualProfileOverride, loading, error, nyaaData, queryIndex, queries.length]);

  useEffect(() => {
    setHasExhaustedQueries(false);
  }, [queryIndex, initial.id]);

  const resetSearchProfiles = () => {
    setQueryIndex(0);
    setManualProfileOverride(false);
    setHasExhaustedQueries(false);
  };

  const selectSearchProfile = (index: number) => {
    setQueryIndex(index);
    setManualProfileOverride(true);
    setHasExhaustedQueries(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-8 lg:p-12 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-5xl bg-gray-900/40 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800 p-3 sm:p-8 max-h-[92dvh] sm:max-h-[90vh] overflow-hidden cursor-default z-50"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-8 h-full overflow-y-auto overscroll-contain pr-1">

            {/* Poster */}
            <div className="w-36 sm:w-48 lg:w-56 aspect-2/3 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-700/50 self-center sm:self-auto">
              <img
                src={initial.poster_url || ""}
                alt={initial.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0 w-full">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-100 break-words pr-2">
                    {initial.title_english || initial.title}
                  </h2>

                  {/* Genres */}
                  {initial.genres && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {initial.genres.split(", ").map((g) => (
                        <span
                          key={g}
                          className="bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded-lg text-xs sm:text-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Score + MAL */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {initial.score && (
                      <span className="text-yellow-300 font-semibold bg-yellow-900/30 px-2 py-1 rounded-lg text-xs sm:text-sm">
                        ⭐ {initial.score}
                      </span>
                    )}

                    {initial.url && (
                      <a
                        href={initial.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 text-xs sm:text-sm font-medium text-indigo-300 bg-indigo-900/30 rounded-lg hover:bg-indigo-800/50 transition"
                      >
                        View on MAL
                      </a>
                    )}
                  </div>

                  {/* Studios + Source */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {initial.studios && (
                      <span className="bg-green-900/30 text-green-300 px-2 py-0.5 rounded-lg text-xs sm:text-sm">
                        {initial.studios}
                      </span>
                    )}
                    {initial.source && (
                      <span className="bg-pink-900/30 text-pink-300 px-2 py-0.5 rounded-lg text-xs sm:text-sm">
                        {formatSource(initial.source)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close anime details"
                  className="text-gray-400 hover:text-gray-200 transition p-1 rounded-full shrink-0"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              {/* Synopsis */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-300 whitespace-pre-line line-clamp-8 sm:line-clamp-10">
                {initial.synopsis}
              </p>

              {/* Torrents */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-gray-100 text-lg">
                  Nyaa Torrents
                </h3>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {SEARCH_PROFILES.map((profile, index) => {
                      const isActive = index === queryIndex;

                      return (
                        <button
                          key={profile.label}
                          type="button"
                          onClick={() => selectSearchProfile(index)}
                          className={`px-2.5 py-1 rounded-lg text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 ${
                            isActive
                              ? "border-indigo-500/70 bg-indigo-900/40 text-indigo-200"
                              : "border-gray-700 bg-gray-800/60 text-gray-300 hover:border-gray-600 hover:text-gray-200"
                          }`}
                          aria-pressed={isActive}
                        >
                          {profile.label}
                        </button>
                      );
                    })}
                    {manualProfileOverride && (
                      <button
                        type="button"
                        onClick={resetSearchProfiles}
                        className="px-2.5 py-1 rounded-lg text-xs border border-gray-600 bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                      >
                        Auto fallback
                      </button>
                    )}
                  </div>
                </div>

                {loading && (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-400">Searching torrents...</p>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-red-900/40 bg-red-950/30 p-3">
                    <p className="text-red-300">Could not load torrents right now.</p>
                    <button
                      type="button"
                      onClick={resetSearchProfiles}
                      className="mt-2 text-sm px-3 py-1.5 rounded-lg border border-red-300/30 text-red-100 hover:bg-red-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70"
                    >
                      Retry search
                    </button>
                  </div>
                )}

                {!loading && !error && hasExhaustedQueries && (
                  <div className="rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                    <p className="text-gray-300">No torrents found for available profiles.</p>
                    <button
                      type="button"
                      onClick={resetSearchProfiles}
                      className="mt-2 text-sm px-3 py-1.5 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
                    >
                      Try again
                    </button>
                  </div>
                )}

                <div className="max-h-72 sm:max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-700/60 scrollbar-track-gray-800/30">
                  <ul>
                    {nyaaData?.torrents?.map((t) => (
                      <li
                        key={t.id}
                        className="my-3 sm:my-4 p-3 sm:p-4 bg-gray-800/40 rounded-2xl border border-gray-700 hover:border-gray-600 hover:shadow-lg transition"
                      >
                        {/* Name */}
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm sm:text-base font-semibold text-gray-100 hover:text-indigo-400 transition line-clamp-2"
                        >
                          {t.name}
                        </a>

                        {/* Tags */}
                        <div className="flex flex-wrap text-xs gap-2 mt-2">
                          <span className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded-lg">
                            <FaFilm /> {t.category}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-700/30 text-gray-300 px-2 py-0.5 rounded-lg">
                            <FaBox /> {t.size}
                          </span>
                          <span className="flex items-center gap-1 bg-green-900/30 text-green-300 px-2 py-0.5 rounded-lg">
                            <FaArrowUp /> {t.seeders}
                          </span>
                          <span className="flex items-center gap-1 bg-red-900/30 text-red-300 px-2 py-0.5 rounded-lg">
                            <FaArrowDown /> {t.leechers}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-700/30 text-gray-300 px-2 py-0.5 rounded-lg">
                            <FaDownload /> {t.downloads}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-700/30 text-gray-400 px-2 py-0.5 rounded-lg">
                            <FaRegCalendarAlt /> {t.date}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                          <a
                            href={t.magnet}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold bg-indigo-900/40 text-indigo-300 rounded-xl hover:bg-indigo-800/60 transition"
                          >
                            <FaMagnet /> Magnet
                          </a>
                          <a
                            href={t.downloadUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold bg-gray-700/40 text-gray-200 rounded-xl hover:bg-gray-600/50 transition"
                          >
                            <FaDownload /> Download
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}