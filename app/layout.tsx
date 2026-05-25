import "../styles/globals.css";
import React from "react";

export const metadata = {
  title: "Anime Schedule",
  description: "Current english dubbed Anime schedule",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-gray-100 min-h-screen flex flex-col antialiased">
        <div className="flex-1 page-enter">
          {children}
        </div>

        <footer className="w-full py-4 text-center text-xs text-[color:var(--text-muted)] border-t border-[color:var(--surface-border)] bg-black/10 backdrop-blur-sm">
          Data sourced from the community-maintained{" "}
          <a
            href="https://myanimelist.net/forum/?topicid=1692966"
            target="_blank"
            rel="noreferrer"
            className="text-gray-200 hover:text-orange-200 transition-colors"
          >
            MyAnimeList Dub Schedule
          </a>
          . Thanks to <span className="font-medium text-gray-100">Kenny_Stryker</span> & contributors.
        </footer>
      </body>
    </html>
  );
}