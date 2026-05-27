import DayTabs from "../components/DayTabs";
import { fetchSchedule } from "../lib/api";

export default async function Page() {
  const schedule = await fetchSchedule();
  const totalShows = schedule.days.reduce((sum, d) => sum + d.anime.length, 0);

  return (
    <div className="flex flex-col items-center px-3 sm:px-6 md:px-8 py-4 sm:py-7">
      <div className="w-full max-w-5xl surface-panel rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-5 sm:py-6 mb-5 sm:mb-6">
        <div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-orange-200/85 font-semibold">
            Weekly Dub Tracker
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 leading-tight">
            Anime Schedule
          </h1>
          <p className="mt-1.5 text-xs text-[color:var(--text-muted)]">
            {totalShows} shows airing this week
          </p>
        </div>
      </div>
      <div className="w-full max-w-5xl">
        <DayTabs days={schedule.days} />
      </div>
    </div>
  );
}