import { notFound } from "next/navigation";
import AnimeDetailsClient from "../../../components/AnimeDetailsClient";
import { fetchArchive, fetchSchedule } from "../../../lib/api";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const animeId = Number(resolvedParams.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return { title: "Not Found — Anime Schedule" };
  }

  const scheduleResponse = await fetchSchedule();
  let anime = scheduleResponse.days
    .flatMap((day) => day.anime)
    .find((a) => a.id === animeId);

  if (!anime) {
    const archiveResponse = await fetchArchive();
    anime = archiveResponse.archive.find((a) => a.id === animeId);
  }

  if (!anime) {
    return { title: "Not Found — Anime Schedule" };
  }

  const title = anime.title_english || anime.title;
  return {
    title: `${title} — Anime Schedule`,
    description: anime.synopsis?.slice(0, 160) || `Details for ${title}`,
    openGraph: {
      title,
      description: anime.synopsis?.slice(0, 160) || `Details for ${title}`,
      ...(anime.poster_url ? { images: [{ url: anime.poster_url }] } : {}),
    },
  };
}

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

  // Try schedule first (cached/fast via ISR), only fetch archive if not found
  const scheduleResponse = await fetchSchedule();
  let anime = scheduleResponse.days
    .flatMap((day) => day.anime)
    .find((a) => a.id === animeId);

  if (!anime) {
    const archiveResponse = await fetchArchive();
    anime = archiveResponse.archive.find((a) => a.id === animeId);
  }

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
