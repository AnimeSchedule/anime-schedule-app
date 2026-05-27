"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalendarAlt, FaArchive } from "react-icons/fa";

const NAV_ITEMS = [
  { href: "/", label: "Schedule", icon: FaCalendarAlt },
  { href: "/archive", label: "Archive", icon: FaArchive },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-40 w-full border-b border-[color:var(--surface-border)] bg-[color:var(--bg-0)]/80 backdrop-blur-lg"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-gray-100 hover:text-orange-100 transition-colors"
        >
          Anime Schedule
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/anime")
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-300/16 text-orange-100 border border-orange-300/35"
                    : "text-[color:var(--text-muted)] hover:text-gray-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
