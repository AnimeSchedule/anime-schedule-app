"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaBox,
  FaDownload,
  FaExternalLinkAlt,
  FaMagnet,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { AnimeItem } from "../lib/api";
import { formatSource } from "../lib/format";
import { motion, AnimatePresence } from "framer-motion";
import useNyaa from "../hooks/useNyaa";

function cleanSearchTerm(term: string) {
  return term.replace(/['":]/g, "");
}

function simplifyTitle(title: string): string {
  return title
    .replace(/\s*Part\s*\d+.*/i, '')
    .replace(/\s*Season\s*\d+.*/i, '')
    .replace(/\s*\d+(?:st|nd|rd|th)\s+Season.*/i, '')
    .replace(/\s*Cour\s*\d+.*/i, '')
    .replace(/\s*[:：]\s*.+$/, '')
    .replace(/\s+(?:II|III|IV|V|VI|VII|VIII|IX|X)$/i, '')
    .trim();
}

const SEARCH_PROFILES = [
  {
    label: "VARYG",
    pattern: (title: string, titleEn?: string | null) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `VARYG DUAL 1080p ("${t}"|"${te}")` : `VARYG DUAL 1080p ${t}`;
    },
  },
  {
    label: "Yameii",
    pattern: (title: string, titleEn?: string | null) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `Yameii 1080p ("${t}"|"${te}")` : `Yameii 1080p ${t}`;
    },
  },
  {
    label: "Dub 1080p",
    pattern: (title: string, titleEn?: string | null) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `Dub 1080p ("${t}"|"${te}")` : `Dub 1080p ${t}`;
    },
  },
  {
    label: "Dub (broad)",
    pattern: (title: string, titleEn?: string | null) => {
      const t = simplifyTitle(cleanSearchTerm(title)) || cleanSearchTerm(title);
      const te = titleEn ? simplifyTitle(cleanSearchTerm(titleEn)) || cleanSearchTerm(titleEn) : undefined;
      return `Dub 1080p ${te || t}`;
    },
  },
  {
    label: "Dual Audio (broad)",
    pattern: (title: string, titleEn?: string | null) => {
      const t = simplifyTitle(cleanSearchTerm(title)) || cleanSearchTerm(title);
      const te = titleEn ? simplifyTitle(cleanSearchTerm(titleEn)) || cleanSearchTerm(titleEn) : undefined;
      return `Dual Audio 1080p ${te || t}`;
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
  const { data: nyaaData, loading, error } = useNyaa(searchQuery, initial.id);
  const [hasExhaustedQueries, setHasExhaustedQueries] = useState(false);

  // Keep a ref to the last results that had actual torrents, so we can
  // display them during auto-advance cascades instead of flashing
  // empty → loading → empty → loading…
  // Only used when auto-advancing (not manual profile selection).
  const lastGoodDataRef = useRef(nyaaData);
  if (nyaaData?.torrents?.length) {
    lastGoodDataRef.current = nyaaData;
  }
  // During auto-advance: show last good results as placeholder while cascading.
  // During manual selection: always show real data (even if 0 results).
  const useLastGoodFallback = !manualProfileOverride && loading && (lastGoodDataRef.current?.torrents?.length ?? 0) > 0;
  const displayData = useLastGoodFallback ? lastGoodDataRef.current : nyaaData;
  const hasTorrentsToShow = (displayData?.torrents?.length ?? 0) > 0;
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const synopsisIsLong = (initial.synopsis?.length ?? 0) > 200;
  const [isClosing, setIsClosing] = useState(false);
  const closedViaPopStateRef = useRef(false);
  const isClosingRef = useRef(false);
  const historyStateIdRef = useRef<string | null>(null);

  const handleDismiss = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    // Pop history NOW (before animation) so the async popstate
    // fires while our listener is still active and guarded by isClosingRef.
    if (!closedViaPopStateRef.current && historyStateIdRef.current) {
      const sid = historyStateIdRef.current;
      historyStateIdRef.current = null;
      if (window.history.state?.modalId === sid) {
        window.history.back();
      }
    }
    setIsClosing(true);
  }, []);

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
    lastGoodDataRef.current = undefined;
  };

  useEffect(() => {
    const stateId = `anime-modal-${Date.now()}`;
    historyStateIdRef.current = stateId;
    window.history.pushState({ modalId: stateId }, "");

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };

    const handlePopState = () => {
      closedViaPopStateRef.current = true;
      historyStateIdRef.current = null;
      handleDismiss();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleDismiss]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        onClick={handleDismiss}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center overflow-y-auto md:p-6 lg:p-10 cursor-pointer"
        role="dialog"
        aria-modal="true"
        aria-label={initial.title_english || initial.title}
        initial={{ opacity: 0 }}
        animate={isClosing ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onAnimationComplete={() => {
          if (isClosing) onClose();
        }}
      >
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-4xl sm:my-auto rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[95dvh] sm:max-h-[88vh] flex flex-col cursor-default shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={
            isClosing
              ? { opacity: 0, y: 60, scale: 0.97 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Sticky close button — always visible */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/50 text-white/90 hover:bg-black/70 hover:text-white transition-colors shadow-lg"
          >
            <AiOutlineClose size={16} />
          </button>

          <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 bg-[color:var(--bg-1)] scrollbar-thin scrollbar-thumb-orange-400/50 scrollbar-track-transparent">

            {/* ── Hero banner ── */}
            <div className="relative w-full h-[200px] sm:h-[260px] bg-[linear-gradient(135deg,#1a1225_0%,#0d0a12_50%,#17121c_100%)]">
              {initial.poster_url && (
                <img
                  src={initial.poster_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/5" />
              {!initial.poster_url && (
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              )}

              {/* Overlaid info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {initial.title_english || initial.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs">
                  <span className="text-amber-200 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    ⭐ {initial.score ?? "N/A"}
                  </span>
                  {initial.studios && (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="text-gray-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{initial.studios}</span>
                    </>
                  )}
                  {initial.source && (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="text-gray-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{formatSource(initial.source)}</span>
                    </>
                  )}
                </div>

                {initial.genres && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {initial.genres.split(", ").map((genre) => (
                      <span
                        key={genre}
                        className="bg-white/10 text-white/80 px-2 py-0.5 rounded-md text-[10px] sm:text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Body ── */}
            <div className="px-4 sm:px-6 pt-4 pb-2">
              {initial.synopsis && (
                <div className="mb-3">
                  <p
                    className={`text-sm text-gray-300/90 whitespace-pre-line leading-relaxed ${
                      !synopsisExpanded && synopsisIsLong ? "line-clamp-3" : ""
                    }`}
                  >
                    {initial.synopsis}
                  </p>
                  {synopsisIsLong && (
                    <button
                      type="button"
                      onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                      className="mt-1 text-xs text-orange-200/70 hover:text-orange-100 transition-colors"
                    >
                      {synopsisExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

              {initial.url && (
                <a
                  href={initial.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-orange-200/70 hover:text-orange-100 transition-colors"
                >
                  View on MAL
                  <FaExternalLinkAlt size={9} />
                </a>
              )}

              {initial.status && (
                <div className="mt-3 space-y-1.5">
                  {initial.status.total ? (
                    <>
                      <div className="flex justify-between text-xs text-[color:var(--text-muted)]">
                        <span>Episode Progress</span>
                        <span>{initial.status.aired} / {initial.status.total}</span>
                      </div>
                      <div className="relative w-full h-[3px] bg-slate-700/80 rounded-full">
                        <div
                          className="absolute inset-y-0 left-0 bg-orange-300 rounded-full transition-[width] duration-500"
                          style={{ width: `${(initial.status.aired / initial.status.total) * 100}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs text-[color:var(--text-muted)]">
                        <span>Airing</span>
                        <span>Episode {initial.status.aired}</span>
                      </div>
                      <div className="relative w-full h-[3px] bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/70 via-amber-100/40 to-orange-300/70 animate-[pulse_2.2s_ease-in-out_infinite]" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Torrents ── */}
            <section className="border-t border-[color:var(--surface-border)] mx-4 sm:mx-6 pt-4 pb-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-100">Nyaa Torrents</h3>
                {manualProfileOverride && (
                  <button
                    type="button"
                    onClick={resetSearchProfiles}
                    className="px-2 py-0.5 rounded-md text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {SEARCH_PROFILES.map((profile, index) => {
                  const isActive = index === queryIndex;
                  return (
                    <button
                      key={profile.label}
                      type="button"
                      onClick={() => selectSearchProfile(index)}
                      aria-pressed={isActive}
                      className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 ${
                        isActive
                          ? "border-orange-300/50 bg-orange-300/16 text-orange-100 font-medium"
                          : "border-[color:var(--surface-border)] bg-[color:var(--surface-0)] text-gray-400 hover:text-gray-200 hover:border-orange-200/25"
                      }`}
                    >
                      {profile.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {loading && !hasTorrentsToShow ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-3 py-8 justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="w-5 h-5 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <p className="text-sm text-gray-400">Searching...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-xl border border-rose-400/20 bg-rose-500/8 p-3"
                  >
                    <p className="text-sm text-rose-200">Could not load torrents.</p>
                    <button
                      type="button"
                      onClick={resetSearchProfiles}
                      className="mt-2 text-xs px-3 py-1.5 rounded-lg border border-rose-300/20 text-rose-100 hover:bg-rose-500/10 transition-colors"
                    >
                      Retry
                    </button>
                  </motion.div>
                ) : !loading && hasExhaustedQueries && !hasTorrentsToShow ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] p-3"
                  >
                    <p className="text-sm text-gray-400">No torrents found.</p>
                    <button
                      type="button"
                      onClick={resetSearchProfiles}
                      className="mt-2 text-xs px-3 py-1.5 rounded-lg border border-[color:var(--surface-border)] text-gray-300 hover:text-gray-100 transition-colors"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : hasTorrentsToShow ? (
                  <motion.div
                    key={`results-${queryIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative"
                  >
                    {loading && (
                      <div className="absolute inset-x-0 top-0 flex justify-center py-2 z-10">
                        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <div className="w-3.5 h-3.5 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-gray-300">Updating...</span>
                        </div>
                      </div>
                    )}
                    <ul className={`space-y-2 ${loading ? "opacity-60 transition-opacity" : ""}`}>
                      {displayData?.torrents?.map((t) => (
                      <li
                        key={t.id}
                        className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] p-3 hover:border-orange-300/20 transition-colors"
                      >
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm font-medium text-gray-100 hover:text-orange-200 transition-colors line-clamp-2 leading-snug"
                        >
                          {t.name}
                        </a>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[color:var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <FaBox size={9} /> {t.size}
                          </span>
                          <span className="flex items-center gap-1 text-emerald-300/80">
                            <FaArrowUp size={9} /> {t.seeders}
                          </span>
                          <span className="flex items-center gap-1 text-rose-300/70">
                            <FaArrowDown size={9} /> {t.leechers}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaDownload size={9} /> {t.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRegCalendarAlt size={9} /> {t.date}
                          </span>
                        </div>

                        <div className="mt-2.5 flex gap-2">
                          <a
                            href={t.magnet}
                            className="inline-flex items-center gap-1 rounded-lg bg-orange-400/12 border border-orange-300/25 px-2.5 py-1 text-xs font-medium text-orange-100 hover:bg-orange-300/20 transition-colors"
                          >
                            <FaMagnet size={10} /> Magnet
                          </a>
                          <a
                            href={t.downloadUrl}
                            className="inline-flex items-center gap-1 rounded-lg bg-[color:var(--surface-1)] border border-[color:var(--surface-border)] px-2.5 py-1 text-xs font-medium text-gray-200 hover:text-gray-100 transition-colors"
                          >
                            <FaDownload size={10} /> .torrent
                          </a>
                        </div>
                      </li>
                    ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
