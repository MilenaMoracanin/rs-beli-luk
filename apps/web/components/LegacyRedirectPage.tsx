"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sezona");
  }, [router]);

  return (
    <p className="text-sm text-gray-500">Preusmeravanje na Sezonu…</p>
  );
}
