import "../styles/globals.css";
import React from "react";
import { Space_Grotesk } from "next/font/google";
import Navbar from "../components/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-main",
  display: "swap",
});

export const metadata = {
  title: "Anime Schedule",
  description: "Current english dubbed Anime schedule",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable} style={{ colorScheme: 'dark' }}>
      <body className="text-gray-100 min-h-screen flex flex-col antialiased">
        <Navbar />
        <div className="flex-1 page-enter">
          {children}
        </div>

        <footer className="w-full py-6 sm:py-8 text-center text-xs border-t border-[color:var(--surface-border)] bg-[color:var(--bg-1)]">
          <p className="text-[color:var(--text-muted)]">
            Data sourced from the community-maintained{" "}
            <a
              href="https://myanimelist.net/forum/?topicid=1692966"
              target="_blank"
              rel="noreferrer"
              className="text-gray-200 hover:text-orange-200 transition-colors"
            >
              MyAnimeList Dub Schedule
            </a>
          </p>
          <p className="mt-1.5 text-[10px] text-gray-500">
            Thanks to <span className="font-medium text-gray-400">Kenny_Stryker</span> & contributors
          </p>
        </footer>
      </body>
    </html>
  );
}