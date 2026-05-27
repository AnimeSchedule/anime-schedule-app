"use client";
import { motion } from "framer-motion";

export default function ArchiveHeader({ totalCount }: { totalCount?: number }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full surface-panel rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-5 sm:py-6 mb-8 relative"
    >
      <div>
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-orange-200/85 font-semibold">
          Completed Series
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
          Archive
        </h1>
        {totalCount != null && (
          <p className="mt-1.5 text-xs text-[color:var(--text-muted)]">
            {totalCount} titles in archive
          </p>
        )}
      </div>
    </motion.div>
  );
}
