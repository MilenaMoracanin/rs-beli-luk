import { Nav } from "@/components/Nav";
import { SeasonProvider } from "@/lib/season/season-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <SeasonProvider>{children}</SeasonProvider>
      </main>
    </div>
  );
}
