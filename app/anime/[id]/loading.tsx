import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function LoadingAnimeDetails() {
  return (
    <div className="min-h-[calc(100svh-4.5rem)] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      <div className="w-full max-w-6xl rounded-2xl sm:rounded-3xl border border-[color:var(--surface-border)] bg-[color:var(--surface-0)] p-4 sm:p-6 lg:p-8 shadow-[0_24px_48px_rgba(6,12,24,0.42)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-orange-300/35 bg-orange-400/12 px-3 py-1.5 text-sm text-orange-100 hover:border-orange-200/70 hover:bg-orange-300/20 transition-colors"
        >
          <FaArrowLeft />
          Back
        </Link>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          <div className="w-full max-w-[260px] lg:max-w-none mx-auto lg:mx-0 aspect-2/3 rounded-xl bg-slate-800/70 animate-pulse" />

          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-lg bg-slate-800/70 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-800/70 animate-pulse" />
              ))}
            </div>
            <div className="flex gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 w-16 rounded-lg bg-slate-800/70 animate-pulse" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800/70 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-800/70 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-slate-800/70 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-600/35 pt-6">
          <div className="h-6 w-32 rounded-lg bg-slate-800/70 animate-pulse" />
          <div className="mt-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-800/70 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
