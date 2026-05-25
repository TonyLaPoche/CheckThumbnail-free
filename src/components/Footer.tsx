"use client";

import { useI18n } from "@/i18n/context";

const PORTFOLIO_URL = "https://antoineterrade.com";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const copyright = t.footer.copyright.replace("{year}", String(year));

  return (
    <footer className="mt-16 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-500">
      <p>{copyright}</p>
      <p className="mt-2">
        <a
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500 hover:text-emerald-400 hover:underline transition"
        >
          {t.footer.portfolio} — antoineterrade.com
        </a>
      </p>
    </footer>
  );
}
