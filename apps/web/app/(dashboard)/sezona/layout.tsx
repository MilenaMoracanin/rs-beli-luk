import { SezonaLayoutClient } from "@/components/SezonaLayoutClient";

export default function SezonaLayout({ children }: { children: React.ReactNode }) {
  return <SezonaLayoutClient>{children}</SezonaLayoutClient>;
}
