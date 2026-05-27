"use client";
import useSWR from "swr";
import { getCachedNyaa, setCachedNyaa } from "../lib/nyaaCache";

async function fetcher(q: string) {
  const cached = getCachedNyaa(q);
  if (cached) return cached;

  const encoded = encodeURIComponent(q);
  const url = `${process.env.NEXT_PUBLIC_NYAA_API_URL}/?f=0&c=1_2&q=${encoded}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("nyaa fetch failed");
  const json = await res.json();
  setCachedNyaa(q, json.data);
  return json.data;
}

/**
 * useNyaa('VARYG DUAL 1080p Your Title', animeId)
 * caches automatically in memory (per server process) via lib/nyaaCache
 */
export default function useNyaa(q: string, keySuffix?: number) {
  const swrKey = q + (keySuffix ? `:${keySuffix}` : "");
  const { data, error, isLoading } = useSWR(swrKey, () => fetcher(q), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  });

  return { data, loading: isLoading, error };
}
