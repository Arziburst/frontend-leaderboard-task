import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Racing Leaderboard",
  description: "Virtualized infinite leaderboard for a racing mini game.",
};

export default function RootLayout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#f5f2ff] text-slate-900 antialiased">
        <main className="flex min-h-screen items-center justify-center px-3 py-8">
          <div className="w-full max-w-md rounded-3xl bg-white pr-2 pt-1 pb-1 shadow-xl ring-1 ring-slate-200">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
