"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => switchLocale("nl")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "nl"
            ? "bg-accent text-primary font-semibold"
            : "text-gray-400 hover:text-white"
        }`}
      >
        NL
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en"
            ? "bg-accent text-primary font-semibold"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
