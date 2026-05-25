"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl rounded-2xl border border-red-900/40 bg-red-950/20 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-red-200">Something went wrong</h2>
        <p className="mt-3 text-red-100/90">
          We could not load this page right now. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 px-4 py-2 rounded-lg border border-red-300/30 text-red-100 bg-red-900/30 hover:bg-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/70"
        >
          Retry
        </button>
      </div>
    </div>
  );
}