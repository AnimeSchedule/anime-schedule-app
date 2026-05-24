"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import classNames from "classnames";

export default function HorizontalScroller({
  children,
}: {
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateButtons = () => {
      setHasOverflow(element.scrollWidth > element.clientWidth + 1);
      setCanScrollLeft(element.scrollLeft > 16);
      setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 16);
    };

    updateButtons();
    element.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      element.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  const scroll = (distance: number) => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({ left: distance, behavior: "smooth" });
  };

  const handlePrev = () => {
    const element = scrollRef.current;
    if (!element) return;
    scroll(-element.clientWidth * 0.75);
  };

  const handleNext = () => {
    const element = scrollRef.current;
    if (!element) return;
    scroll(element.clientWidth * 0.75);
  };

  return (
    <div className="relative">
      {hasOverflow && (
        <div className="absolute inset-y-0 left-0 z-50 flex items-center pl-2 sm:pl-3 pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className={classNames(
              "pointer-events-auto flex items-center justify-center h-10 w-10 rounded-full bg-gray-900/80 border border-gray-700 text-gray-300 shadow-lg transition-colors duration-200 hover:bg-gray-800 hover:text-white",
              { "opacity-40 cursor-not-allowed hover:bg-gray-900/80": !canScrollLeft }
            )}
            aria-label="Scroll left"
          >
            <FaChevronLeft size={14} />
          </button>
        </div>
      )}

      {hasOverflow && (
        <div className="absolute inset-y-0 right-0 z-50 flex items-center pr-2 sm:pr-3 pointer-events-none">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollRight}
            className={classNames(
              "pointer-events-auto flex items-center justify-center h-10 w-10 rounded-full bg-gray-900/80 border border-gray-700 text-gray-300 shadow-lg transition-colors duration-200 hover:bg-gray-800 hover:text-white",
              { "opacity-40 cursor-not-allowed hover:bg-gray-900/80": !canScrollRight }
            )}
            aria-label="Scroll right"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-4 min-w-min py-1">{children}</div>
      </div>

    </div>
  );
}
