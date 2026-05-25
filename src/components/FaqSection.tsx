"use client";

import { useI18n } from "@/i18n/context";

export function FaqSection() {
  const { t } = useI18n();

  return (
    <section
      className="max-w-2xl mx-auto mb-10 rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden"
      aria-labelledby="faq-heading"
    >
      <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
        <h2 id="faq-heading" className="text-sm font-semibold text-neutral-200">
          {t.faq.title}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">{t.faq.intro}</p>
      </div>

      <ul className="divide-y divide-neutral-800">
        {t.faq.items.map((item) => (
          <li key={item.id}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-neutral-200 hover:bg-neutral-800/40 transition [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  className="shrink-0 text-neutral-500 text-lg leading-none transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed">{item.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
