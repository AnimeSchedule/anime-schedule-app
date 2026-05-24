"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
  label,
  onClear,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
  placeholder: string;
  label: string;
  onClear?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedLabel = value || placeholder;

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-gray-800/40 border border-gray-700 text-gray-100 text-left flex items-center justify-between hover:border-gray-600 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
      >
        <span className="text-sm sm:text-base">{selectedLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown size={14} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {value && onClear && (
                <motion.button
                  initial={{ opacity: 0.7 }}
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-indigo-400 hover:text-indigo-300 font-medium border-b border-gray-700 transition-colors"
                >
                  Clear {label}
                </motion.button>
              )}

              {options.map((option) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.15)" }}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    value === option
                      ? "bg-indigo-600/20 text-indigo-300 font-medium"
                      : "text-gray-300 hover:text-gray-100"
                  }`}
                >
                  {option}
                </motion.button>
              ))}

              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
