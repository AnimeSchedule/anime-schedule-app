import Link from "next/link";

export default function AnimeDetailsNotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 text-center">
      <div className="surface-panel rounded-2xl p-6 sm:p-8 max-w-xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Anime not found</h1>
        <p className="mt-2 text-[color:var(--text-muted)]">
          We could not find details for this title. It may have been removed or the link is invalid.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center rounded-lg border border-orange-300/35 bg-orange-400/12 px-4 py-2 text-sm font-medium text-orange-100 hover:border-orange-200/70 hover:bg-orange-300/20 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
