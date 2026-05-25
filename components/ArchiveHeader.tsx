"use client";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ArchiveHeader() {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full surface-panel rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-4 mb-8"
    >
      <Link
        href="/"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-400/12 border border-orange-300/35 hover:bg-orange-300/20 hover:border-orange-200/70 transition-all duration-200 group"
        title="Back to home"
      >
        <FaArrowLeft className="text-orange-100/80 group-hover:text-orange-50 transition-colors" size={18} />
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">
        Archive
      </h1>
    </motion.div>
  );
}
