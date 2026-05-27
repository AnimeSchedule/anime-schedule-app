import ArchiveHeader from "../../components/ArchiveHeader";

export default function ArchiveLoading() {
  return (
    <div className="min-h-[calc(100svh-4.5rem)] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-7xl">
        <ArchiveHeader />

        {/* Controls skeleton */}
        <div className="mb-8 surface-panel rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="h-12 rounded-xl bg-slate-800/70 animate-pulse" />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-11 w-full sm:w-48 rounded-xl bg-slate-800/70 animate-pulse" />
            <div className="h-11 w-full sm:w-48 rounded-xl bg-slate-800/70 animate-pulse" />
          </div>
        </div>

        {/* Month group skeletons */}
        {[1, 2].map((i) => (
          <div key={i} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-7 w-40 rounded-lg bg-slate-800/70 animate-pulse" />
              <div className="h-5 w-8 rounded-full bg-slate-800/70 animate-pulse" />
              <div className="flex-1 h-px bg-slate-800/50" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-40 sm:w-44 md:w-48 lg:w-56 aspect-2/3 rounded-xl bg-slate-800/70 border border-slate-600/45 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}