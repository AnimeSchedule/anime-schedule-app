export default function LoadingAnimeDetails() {
  return (
    <div className="min-h-[calc(100svh-4.5rem)] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="w-9 h-9 border-4 border-orange-300 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-200 text-lg font-medium">Loading anime details...</p>
      <p className="text-sm text-[color:var(--text-muted)]">Fetching metadata and torrent results.</p>
    </div>
  );
}
