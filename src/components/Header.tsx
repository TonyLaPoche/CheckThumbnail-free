"use client";

import { useI18n } from "@/i18n/context";
import type { Locale } from "@/i18n/messages";

const locales: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="relative mb-10">
      <div className="absolute right-0 top-0 flex rounded-lg border border-neutral-700 overflow-hidden text-sm">
        {locales.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`px-3 py-1.5 font-medium transition ${
              locale === code
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            }`}
            aria-pressed={locale === code}
            aria-label={code === "fr" ? "Français" : "English"}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="text-center pt-2 sm:pt-0">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Check <span className="text-emerald-500">Thumbnail</span>
        </h1>
        <p className="mt-3 text-neutral-400 max-w-lg mx-auto text-sm sm:text-base px-8 sm:px-0">
          {t.header.subtitle}
        </p>
      </div>
    </header>
  );
}
