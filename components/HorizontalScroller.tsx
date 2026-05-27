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

    let ticking = false;

    const updateButtons = () => {
      setHasOverflow(element.scrollWidth > element.clientWidth + 1);
      setCanScrollLeft(element.scrollLeft > 16);
      setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 16);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateButtons();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateButtons();
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateButtons);

    return () => {
      element.removeEventListener("scroll", onScroll);
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
        <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-2 sm:pl-3 pointer-events-none">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className={classNames(
              "pointer-events-auto flex items-center justify-center h-10 w-10 rounded-full bg-[color:var(--surface-0)] border border-[color:var(--surface-border)] text-orange-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:bg-orange-300/12 hover:text-orange-100 hover:border-orange-300/35",
              { "opacity-40 cursor-not-allowed hover:bg-[color:var(--surface-0)]": !canScrollLeft }
            )}
            aria-label="Scroll left"
          >
            <FaChevronLeft size={14} />
          </button>
        </div>
      )}

      {hasOverflow && (
        <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-2 sm:pr-3 pointer-events-none">
          <button
            type="button"
            onClick={handleNext}
            disabled={!canScrollRight}
            className={classNames(
              "pointer-events-auto flex items-center justify-center h-10 w-10 rounded-full bg-[color:var(--surface-0)] border border-[color:var(--surface-border)] text-orange-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:bg-orange-300/12 hover:text-orange-100 hover:border-orange-300/35",
              { "opacity-40 cursor-not-allowed hover:bg-[color:var(--surface-0)]": !canScrollRight }
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
        <div className="flex gap-4 min-w-min py-6 px-3">{children}</div>
      </div>

    </div>
  );
}
