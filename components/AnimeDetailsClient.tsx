"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowUp,
  FaBox,
  FaDownload,
  FaExternalLinkAlt,
  FaFilm,
  FaMagnet,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { AnimeItem } from "../lib/api";
import { formatSource } from "../lib/format";
import useNyaa from "../hooks/useNyaa";

function cleanSearchTerm(term: string) {
  return term.replace(/['":]/g, "");
}

const SEARCH_PROFILES = [
  {
    label: "VARYG Dual Audio",
    pattern: (title: string, titleEn?: string | null) => {
      const t = cleanSearchTerm(title);
      const te = titleEn ? cleanSearchTerm(titleEn) : undefined;
      return te ? `VARYG DUAL 1080p ("${t}"|"${te}")` : `VARYG DUAL 1080p ${t}`;
    },
  },
  {
    label: "Yameii Dual Audio",
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
];

export default function AnimeDetailsClient({
  anime,
  backHref,
  shouldUseHistoryBack,
}: {
  anime: AnimeItem;
  backHref: string;
  shouldUseHistoryBack: boolean;
}) {
  const router = useRouter();
  const queries = useMemo(
    () => SEARCH_PROFILES.map((p) => p.pattern(anime.title, anime.title_english)),
    [anime.title, anime.title_english]
  );

  const [queryIndex, setQueryIndex] = useState(0);
  const [manualProfileOverride, setManualProfileOverride] = useState(false);
  const [hasExhaustedQueries, setHasExhaustedQueries] = useState(false);

  const searchQuery = queries[queryIndex];
  const { data: nyaaData, loading, error } = useNyaa(searchQuery, anime.id);

  useEffect(() => {
    if (manualProfileOverride || loading || error) return;

    if (nyaaData?.torrents?.length === 0 && queryIndex < queries.length - 1) {
      setQueryIndex((prev) => prev + 1);
      setHasExhaustedQueries(false);
      return;
    }

    if (nyaaData?.torrents?.length === 0 && queryIndex === queries.length - 1) {
      setHasExhaustedQueries(true);
    }
  }, [manualProfileOverride, loading, error, nyaaData, queryIndex, queries.length]);

  useEffect(() => {
    setQueryIndex(0);
    setManualProfileOverride(false);
    setHasExhaustedQueries(false);
  }, [anime.id]);

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

  const handleBack = useCallback(() => {
    if (shouldUseHistoryBack && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  }, [backHref, router, shouldUseHistoryBack]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleBack]);

  return (
    <div className="w-full max-w-6xl rounded-2xl sm:rounded-3xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] backdrop-blur-md p-4 sm:p-6 lg:p-8 shadow-[0_24px_48px_rgba(6,12,24,0.42)]">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-lg border border-orange-300/35 bg-orange-400/12 px-3 py-1.5 text-sm text-orange-100 hover:border-orange-200/70 hover:bg-orange-300/20 transition-colors"
        >
          <FaArrowLeft />
          Back
        </button>

        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] uppercase tracking-[0.15em]">Anime Details</p>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
        <div className="w-full max-w-[260px] lg:max-w-none mx-auto lg:mx-0 aspect-2/3 rounded-xl overflow-hidden border border-slate-600/45 shadow-[0_16px_32px_rgba(5,10,22,0.38)]">
          {anime.poster_url ? (
            <img src={anime.poster_url} alt={anime.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[color:var(--text-muted)] font-semibold tracking-wide">
              NO POSTER
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 break-words tracking-tight">
            {anime.title_english || anime.title}
          </h1>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-600/35 bg-slate-900/40 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] font-semibold">Rating</p>
              <p className="mt-1 text-sm sm:text-base text-amber-200 font-semibold">
                {anime.score ? `⭐ ${anime.score}` : "Not rated"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-600/35 bg-slate-900/40 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] font-semibold">Studio</p>
              <p className="mt-1 text-sm sm:text-base text-emerald-100 font-medium">
                {anime.studios || "Unknown"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-600/35 bg-slate-900/40 px-3 py-2.5 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] font-semibold">Genres</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(anime.genres ? anime.genres.split(", ") : ["Unknown"]).map((genre) => (
                  <span
                    key={genre}
                    className="bg-teal-300/12 text-teal-100 border border-teal-200/20 px-2 py-0.5 rounded-lg text-xs sm:text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-600/35 bg-slate-900/40 px-3 py-2.5 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--text-muted)] font-semibold">Source</p>
              <p className="mt-1 text-sm sm:text-base text-orange-100 font-medium">
                {anime.source ? formatSource(anime.source) : "Unknown"}
              </p>
            </div>
          </div>

          {anime.url && (
            <a
              href={anime.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-400/18 border border-orange-300/35 px-4 py-2 text-sm font-semibold text-orange-50 hover:bg-orange-300/26 hover:border-orange-200/70 transition-colors"
            >
              <span>View on MyAnimeList</span>
              <FaExternalLinkAlt size={12} />
            </a>
          )}

          {anime.synopsis && (
            <p className="mt-4 text-sm sm:text-base text-gray-300/90 whitespace-pre-line leading-relaxed">
              {anime.synopsis}
            </p>
          )}
        </div>
      </div>

      <section className="mt-8 border-t border-slate-600/35 pt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">Nyaa Torrents</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {SEARCH_PROFILES.map((profile, index) => {
            const isActive = index === queryIndex;
            return (
              <button
                key={profile.label}
                type="button"
                onClick={() => selectSearchProfile(index)}
                aria-pressed={isActive}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 ${
                  isActive
                    ? "border-orange-300/60 bg-orange-300/18 text-orange-100"
                    : "border-slate-600/40 bg-slate-900/60 text-gray-300 hover:border-orange-200/30 hover:text-gray-100"
                }`}
              >
                {profile.label}
              </button>
            );
          })}

          {manualProfileOverride && (
            <button
              type="button"
              onClick={resetSearchProfiles}
              className="px-2.5 py-1 rounded-lg text-xs border border-slate-600/40 bg-slate-900/60 text-gray-300 hover:bg-slate-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
            >
              Auto fallback
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="w-8 h-8 border-4 border-orange-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Searching torrents...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3">
            <p className="text-rose-200">Could not load torrents right now.</p>
            <button
              type="button"
              onClick={resetSearchProfiles}
              className="mt-2 text-sm px-3 py-1.5 rounded-lg border border-rose-300/30 text-rose-100 hover:bg-rose-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/70"
            >
              Retry search
            </button>
          </div>
        )}

        {!loading && !error && hasExhaustedQueries && (
          <div className="mt-4 rounded-lg border border-slate-600/35 bg-slate-900/55 p-3">
            <p className="text-gray-300">No torrents found for available profiles.</p>
            <button
              type="button"
              onClick={resetSearchProfiles}
              className="mt-2 text-sm px-3 py-1.5 rounded-lg border border-slate-500/50 text-gray-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (nyaaData?.torrents?.length ?? 0) > 0 && (
          <ul className="mt-4 space-y-3">
            {nyaaData?.torrents?.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-slate-600/35 bg-slate-900/55 p-3 sm:p-4 hover:border-cyan-300/30 hover:shadow-[0_14px_26px_rgba(6,12,24,0.44)] transition"
              >
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm sm:text-base font-semibold text-gray-100 hover:text-orange-200 transition line-clamp-2"
                >
                  {t.name}
                </a>

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 bg-teal-300/12 text-teal-100 border border-teal-200/20 px-2 py-0.5 rounded-lg">
                    <FaFilm /> {t.category}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-700/45 text-gray-200 px-2 py-0.5 rounded-lg">
                    <FaBox /> {t.size}
                  </span>
                  <span className="flex items-center gap-1 bg-emerald-400/12 text-emerald-100 border border-emerald-200/20 px-2 py-0.5 rounded-lg">
                    <FaArrowUp /> {t.seeders}
                  </span>
                  <span className="flex items-center gap-1 bg-rose-400/12 text-rose-100 border border-rose-200/20 px-2 py-0.5 rounded-lg">
                    <FaArrowDown /> {t.leechers}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-700/45 text-gray-200 px-2 py-0.5 rounded-lg">
                    <FaDownload /> {t.downloads}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-700/45 text-slate-300 px-2 py-0.5 rounded-lg">
                    <FaRegCalendarAlt /> {t.date}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={t.magnet}
                    className="inline-flex items-center gap-1 rounded-xl bg-orange-400/12 border border-orange-300/25 px-3 py-1 text-xs sm:text-sm font-semibold text-orange-100 hover:bg-orange-300/20 transition"
                  >
                    <FaMagnet /> Magnet
                  </a>
                  <a
                    href={t.downloadUrl}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-700/45 border border-slate-500/35 px-3 py-1 text-xs sm:text-sm font-semibold text-gray-100 hover:bg-slate-600/55 transition"
                  >
                    <FaDownload /> Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
