"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, SEASON_NAME } from "@/lib/site";

const links = [
  { href: "/", label: "Dashboard", match: (p: string) => p === "/" },
  { href: "/sezona", label: SEASON_NAME, match: (p: string) => p.startsWith("/sezona") },
  {
    href: "/istrazivanje/bosut",
    label: "Bosut",
    match: (p: string) => p.startsWith("/istrazivanje"),
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-emerald-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800">
          <span className="text-2xl leading-none" aria-hidden>
            🧄
          </span>
          <span>{SITE_NAME}</span>
        </Link>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2 py-1.5 text-sm font-medium sm:px-3 ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
