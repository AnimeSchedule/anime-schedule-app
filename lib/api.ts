export type AnimeItem = {
  title: string;
  url: string;
  status: { aired: number; total: number } | null;
  id: number;
  title_english?: string | null;
  synopsis?: string;
  num_episodes?: number;
  score?: number;
  poster_url?: string | null;
  source?: string;
  studios?: string;
  genres?: string;
};

export type ArchiveItem = AnimeItem & {
  start_date: string;
  end_date: string;
};

export type Day = {
  day: string;
  anime: AnimeItem[];
};

export type ScheduleResponse = {
  success: boolean;
  days: Day[];
};

export type ArchiveResponse = {
  success: boolean;
  archive: ArchiveItem[];
};

function getApiBaseUrl() {
  const base = process.env.ANIMESCHEDULE_API_URL;
  if (!base) {
    console.error("ANIMESCHEDULE_API_URL is not set. Returning empty data.");
    return null;
  }
  return base.replace(/\/$/, "");
}

export async function fetchSchedule(): Promise<ScheduleResponse> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return { success: false, days: [] };
  }

  const res = await fetch(`${apiBaseUrl}/details`, { next: { revalidate: 60 * 5 } });
  if (!res.ok) {
    throw new Error("Failed to fetch schedule");
  }
  const data = await res.json();
  return data as ScheduleResponse;
}

export async function fetchArchive(): Promise<ArchiveResponse> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return { success: false, archive: [] };
  }

  const res = await fetch(`${apiBaseUrl}/archive/details`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch archive");
  }
  const data = await res.json();
  return data as ArchiveResponse;
}