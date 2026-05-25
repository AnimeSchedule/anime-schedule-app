import { notFound } from "next/navigation";
import AnimeDetailsClient from "../../../components/AnimeDetailsClient";
import { fetchArchive, fetchSchedule } from "../../../lib/api";

export default async function AnimeDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ from?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const animeId = Number(resolvedParams.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    notFound();
  }

  const [scheduleResponse, archiveResponse] = await Promise.all([
    fetchSchedule(),
    fetchArchive(),
  ]);

  const fromSchedule = scheduleResponse.days
    .flatMap((day) => day.anime)
    .find((anime) => anime.id === animeId);

  const fromArchive = archiveResponse.archive.find((anime) => anime.id === animeId);

  const anime = fromSchedule || fromArchive;

  if (!anime) {
    notFound();
  }

  const from = resolvedSearchParams?.from;
  const backHref = from === "archive" ? "/archive" : "/";
  const shouldUseHistoryBack = from === "archive" || from === "home";

  return (
    <div className="min-h-[calc(100svh-4.5rem)] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <AnimeDetailsClient
        anime={anime}
        backHref={backHref}
        shouldUseHistoryBack={shouldUseHistoryBack}
      />
    </div>
  );
}
