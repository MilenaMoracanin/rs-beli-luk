import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/njiva", label: "Njiva" },
  { href: "/sadnja", label: "Sadnja" },
  { href: "/kalendar", label: "Kalendar" },
  { href: "/berba", label: "Berba" },
];

export function Nav() {
  return (
    <nav className="border-b border-emerald-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-emerald-800">
          <span className="text-xl">🧄</span>
          <span>Beli Luk</span>
        </Link>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:px-3"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
