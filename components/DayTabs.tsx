"use client";
import { useState } from "react";
import AnimeCard from "./AnimeCard";
import { Day } from "../lib/api";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";

export default function DayTabs({ days }: { days: Day[] }) {
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const sorted = dayOrder
    .map(d => days.find(x => x.day.toLowerCase() === d))
    .filter(Boolean) as Day[];

  const today = dayOrder[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const initialDay =
    sorted.find(d => d.day.toLowerCase() === today)?.day ??
    sorted[0]?.day ??
    "monday";

  const [active, setActive] = useState(initialDay);
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

  return (
    <div className="flex flex-col items-center w-full">
      {/* Tabs */}
      <nav
        aria-label="Select day"
        className="sticky top-2 sm:top-4 z-20 w-full mb-5 sm:mb-6 rounded-2xl bg-[color:var(--surface-0)] backdrop-blur-md shadow-md border border-[color:var(--surface-border)] overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 min-w-max">
        {sorted.map(d => {
          const isActive = active.toLowerCase() === d.day.toLowerCase();

          return (
            <button
              key={d.day}
              type="button"
              onClick={() => setActive(d.day)}
              aria-pressed={isActive}
              className={classNames(
                "px-4 sm:px-5 py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60",
                {
                  // active
                  "bg-orange-300/16 text-orange-100 shadow-lg border border-orange-300/35": isActive,

                  // inactive
                  "text-[color:var(--text-muted)] hover:bg-white/5 hover:text-gray-200": !isActive,
                }
              )}
            >
              {d.day[0].toUpperCase() + d.day.slice(1)}
            </button>
          );
        })}
        </div>
      </nav>

      {/* Active Day Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.day}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="w-full">
            {activeDay.anime.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}