import Link from "next/link";
import DayTabs from "../components/DayTabs";
import { FaArchive } from "react-icons/fa";
import { fetchSchedule } from "../lib/api";

export default async function Page() {
  const schedule = await fetchSchedule();

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100">
          Anime Schedule
        </h1>
        <Link
          href="/archive"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-100 font-semibold transition-all duration-300 hover:border-indigo-500 hover:bg-gray-800/80 hover:text-gray-50 whitespace-nowrap group"
        >
          <FaArchive size={18} className="group-hover:text-indigo-400 transition-colors" />
          <span>Archive</span>
        </Link>
      </div>
      <div className="w-full max-w-5xl">
        <DayTabs days={schedule.days} />
      </div>
    </div>
  );
}