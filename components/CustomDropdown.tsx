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

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

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
        type="button"
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600/40 text-gray-100 text-left flex items-center justify-between hover:border-orange-200/35 focus:outline-none focus:border-orange-300/55 focus-visible:ring-2 focus-visible:ring-orange-300/60 transition-colors duration-200"
      >
        <span className="text-sm sm:text-base">{selectedLabel}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown size={14} className="text-orange-100/80" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-950/95 border border-slate-600/45 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md"
            role="listbox"
            aria-label={label}
          >
            <div className="max-h-64 overflow-y-auto">
              {value && onClear && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ backgroundColor: "rgba(255, 154, 74, 0.14)" }}
                  onClick={() => {
                    onClear();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-orange-200 hover:text-orange-100 font-medium border-b border-slate-600/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60"
                >
                  Clear {label}
                </motion.button>
              )}

              {options.map((option) => (
                <motion.button
                  type="button"
                  key={option}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ backgroundColor: "rgba(255, 154, 74, 0.12)" }}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={value === option}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    value === option
                        ? "bg-orange-300/20 text-orange-100 font-medium"
                      : "text-gray-300 hover:text-gray-100"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60`}
                >
                  {option}
                </motion.button>
              ))}

              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-[color:var(--text-muted)] text-center">
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
