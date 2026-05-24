"use client";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ArchiveHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex items-center gap-4 mb-8"
    >
      <Link
        href="/"
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/60 border border-gray-700 hover:bg-gray-700 hover:border-indigo-500 transition-all duration-200 group"
        title="Back to home"
      >
        <FaArrowLeft className="text-gray-400 group-hover:text-indigo-400 transition-colors" size={18} />
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-100">
        Archive
      </h1>
    </motion.div>
  );
}
