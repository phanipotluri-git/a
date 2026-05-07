"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/chat",     label: "Chat",            icon: "💬" },
  { href: "/diagnose", label: "Disease Diagnosis", icon: "🔬" },
  { href: "/water",    label: "Water Quality",    icon: "💧" },
  { href: "/feeding",  label: "Feeding Calculator", icon: "🍤" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
      {TABS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "border-b-2 border-teal-600 bg-white text-teal-700"
                : "text-gray-500 hover:text-teal-600"
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
