import Link from "next/link";
import DayTabs from "../components/DayTabs";
import { FaArchive } from "react-icons/fa";
import { fetchSchedule } from "../lib/api";

export default async function Page() {
  const schedule = await fetchSchedule();

  return (
    <div className="flex flex-col items-center px-3 sm:px-6 md:px-8 py-4 sm:py-7">
      <div className="w-full max-w-5xl surface-panel rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-5 sm:mb-6">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-orange-200/85 font-semibold">
            Weekly Dub Tracker
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 leading-tight">
            Anime Schedule
          </h1>
        </div>
        <Link
          href="/archive"
          className="w-full sm:w-auto justify-center sm:justify-start flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-400/12 border border-orange-300/35 text-orange-100 font-semibold transition-all duration-300 hover:border-orange-200/70 hover:bg-orange-300/20 whitespace-nowrap group"
        >
          <FaArchive size={18} className="group-hover:text-orange-50 transition-colors" />
          <span>Archive</span>
        </Link>
      </div>
      <div className="w-full max-w-5xl">
        <DayTabs days={schedule.days} />
      </div>
    </div>
  );
}