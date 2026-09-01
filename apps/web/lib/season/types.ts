import type { getDashboardData } from "@/lib/db/seed";

export type DashboardData = NonNullable<ReturnType<typeof getDashboardData>>;
