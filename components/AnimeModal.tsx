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
  const searchQuery = queries[queryIndex];
  const { data: nyaaData, loading, error } = useNyaa(
    searchQuery,
    initial.id
  );

  useEffect(() => {
    if (loading || error) return;
    if (nyaaData?.torrents?.length === 0 && queryIndex < queries.length - 1) {
      setQueryIndex(queryIndex + 1);
    }
  }, [loading, error, nyaaData, queryIndex, queries.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="overlay"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 sm:p-12 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-5xl bg-gray-900/40 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800 p-4 sm:p-8 max-h-[90vh] overflow-auto cursor-default z-50"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">

            {/* Poster */}
            <div className="w-full sm:w-48 lg:w-56 aspect-2/3 rounded-2xl overflow-hidden border border-gray-700/50">
              <img
                src={initial.poster_url || ""}
                alt={initial.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 wrap-break-word">
                    {initial.title_english || initial.title}
                  </h2>

                  {/* Genres */}
                  {initial.genres && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {initial.genres.split(", ").map((g) => (
                        <span
                          key={g}
                          className="bg-indigo-900/30 text-indigo-300 px-2 py-0.5 rounded-lg text-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Score + MAL */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {initial.score && (
                      <span className="text-yellow-300 font-semibold bg-yellow-900/30 px-2 py-1 rounded-lg text-sm">
                        ⭐ {initial.score}
                      </span>
                    )}

                    {initial.url && (
                      <a
                        href={initial.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 text-sm font-medium text-indigo-300 bg-indigo-900/30 rounded-lg hover:bg-indigo-800/50 transition"
                      >
                        View on MAL
                      </a>
                    )}
                  </div>

                  {/* Studios + Source */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {initial.studios && (
                      <span className="bg-green-900/30 text-green-300 px-2 py-0.5 rounded-lg text-sm">
                        {initial.studios}
                      </span>
                    )}
                    {initial.source && (
                      <span className="bg-pink-900/30 text-pink-300 px-2 py-0.5 rounded-lg text-sm">
                        {formatSource(initial.source)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition p-1 rounded-full"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              {/* Synopsis */}
              <p className="mt-4 text-sm text-gray-300 whitespace-pre-line line-clamp-10">
                {initial.synopsis}
              </p>

              {/* Torrents */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3 text-gray-100 text-lg">
                  Nyaa Torrents
                </h3>

                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {error && (
                  <div className="text-red-400">Error: {String(error)}</div>
                )}

                {!loading && !error && nyaaData?.torrents?.length === 0 && (
                  <div className="text-gray-500">No results found.</div>
                )}

                <div className="max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-700/60 scrollbar-track-gray-800/30">
                  <ul>
                    {nyaaData?.torrents?.map((t) => (
                      <li
                        key={t.id}
                        className="my-4 p-4 bg-gray-800/40 rounded-2xl border border-gray-700 hover:border-gray-600 hover:shadow-lg transition"
                      >
                        {/* Name */}
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-base font-semibold text-gray-100 hover:text-indigo-400 transition line-clamp-2"
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
                        <div className="flex gap-3 mt-3">
                          <a
                            href={t.magnet}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-4 py-1 text-sm font-semibold bg-indigo-900/40 text-indigo-300 rounded-xl hover:bg-indigo-800/60 transition"
                          >
                            <FaMagnet /> Magnet
                          </a>
                          <a
                            href={t.downloadUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-4 py-1 text-sm font-semibold bg-gray-700/40 text-gray-200 rounded-xl hover:bg-gray-600/50 transition"
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