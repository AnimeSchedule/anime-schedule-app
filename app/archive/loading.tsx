import ArchiveHeader from "../../components/ArchiveHeader";

export default function ArchiveLoading() {
  return (
    <div className="min-h-[calc(100svh-4.5rem)] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-7xl">
        <ArchiveHeader />

        <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] p-6 sm:p-8 shadow-[0_18px_34px_rgba(6,12,24,0.4)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-200 font-medium">Loading archive...</p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-2/3 rounded-lg bg-slate-800/70 border border-slate-600/45 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}