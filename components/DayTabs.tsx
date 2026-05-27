"use client";
import { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import AnimeModal from "./AnimeModal";
import { AnimeItem, Day } from "../lib/api";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";

export default function DayTabs({ days }: { days: Day[] }) {
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const sorted = dayOrder
    .map(d => days.find(x => x.day.toLowerCase() === d))
    .filter(Boolean) as Day[];

  const fallbackDay = sorted[0]?.day ?? "monday";
  const [active, setActive] = useState(fallbackDay);
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);

  // Set today's tab on mount (client-only) to avoid hydration mismatch
  useEffect(() => {
    const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const todayDay = sorted.find(d => d.day.toLowerCase() === today)?.day;
    if (todayDay) setActive(todayDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const activeDay =
    sorted.find(d => d.day.toLowerCase() === active.toLowerCase()) ??
    sorted[0];

  if (!activeDay) {
    return (
      <div className="w-full rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] p-6 text-center">
        <p className="text-gray-200 font-medium">Schedule is unavailable right now.</p>
        <p className="text-[color:var(--text-muted)] mt-2 text-sm">Please try again in a moment.</p>
      </div>
    );
  }

  const isToday = active.toLowerCase() === today;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Tabs */}
      <nav
        aria-label="Select day"
        role="tablist"
        className="sticky top-12 z-20 w-full mb-5 sm:mb-6 rounded-2xl bg-[color:var(--surface-0)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] border border-[color:var(--surface-border)] overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 min-w-max">
        {sorted.map(d => {
          const isActive = active.toLowerCase() === d.day.toLowerCase();

          return (
            <button
              key={d.day}
              type="button"
              role="tab"
              onClick={() => setActive(d.day)}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={classNames(
                "px-4 sm:px-5 py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60",
                {
                  // active
                  "bg-orange-300/16 text-orange-100 shadow-lg border border-orange-300/35": isActive,

                  // inactive
                  "text-[color:var(--text-muted)] hover:bg-white/5 hover:text-gray-200 active:bg-white/10": !isActive,
                }
              )}
            >
              {d.day[0].toUpperCase() + d.day.slice(1)}
            </button>
          );
        })}
        </div>
      </nav>

      {/* Floating Today button */}
      <AnimatePresence>
        {!isToday && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setActive(fallbackDay)}
            aria-label="Jump to today's schedule"
            className="fixed bottom-6 right-6 z-30 px-4 py-2.5 rounded-full font-semibold text-sm bg-orange-500 text-white shadow-[0_8px_24px_rgba(234,88,12,0.4)] hover:bg-orange-400 hover:shadow-[0_12px_32px_rgba(234,88,12,0.5)] active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-0)]"
          >
            ← Today
          </motion.button>
        )}
      </AnimatePresence>

      {/* Active Day Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.day}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center space-y-4"
          role="tabpanel"
          aria-label={`${activeDay.day} anime schedule`}
        >
          <div className="w-full">
            {activeDay.anime.map(anime => (
              <AnimeCard key={anime.id} anime={anime} onSelect={setSelectedAnime} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {selectedAnime && (
        <AnimeModal
          initial={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}