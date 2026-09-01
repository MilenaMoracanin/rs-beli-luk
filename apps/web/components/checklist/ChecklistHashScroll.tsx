"use client";

import { useEffect } from "react";

function scrollToHash(hash: string, attempt = 0) {
  if (!hash) return;
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (attempt < 30) {
    window.setTimeout(() => scrollToHash(hash, attempt + 1), 50);
  }
}

export function ChecklistHashScroll() {
  useEffect(() => {
    scrollToHash(window.location.hash);

    function onHashChange() {
      scrollToHash(window.location.hash);
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
