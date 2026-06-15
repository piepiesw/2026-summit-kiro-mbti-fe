"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HomeButton() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/result" || pathname === "/quiz") return null;

  return (
    <Link
      href="/"
      className="fixed top-3 right-3 z-50 p-2 rounded-xl text-white/25 hover:text-white/50 transition-colors"
      aria-label="回首頁"
    >
      <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10L10 3L17 10M5 8.5V16C5 16.55 5.45 17 6 17H8.5V12.5H11.5V17H14C14.55 17 15 16.55 15 16V8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
