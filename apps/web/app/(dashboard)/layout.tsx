import { Nav } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
