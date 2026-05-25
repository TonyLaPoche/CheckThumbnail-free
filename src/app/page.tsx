"use client";

import { FormEvent, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MetaPanel } from "@/components/MetaPanel";
import {
  BlueskyPreview,
  RedditPreview,
  TelegramPreview,
  TwitterPreview,
  WhatsAppPreview,
} from "@/components/platform-previews";
import { useI18n } from "@/i18n/context";
import { OgFetchError } from "@/lib/fetch-errors";
import { fetchOgMetadata } from "@/lib/fetch-og";
import type { OgMetadata } from "@/lib/og-parser";

export default function Home() {
  const { t } = useI18n();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<OgMetadata | null>(null);

  async function handleCheck(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMeta(null);
    setLoading(true);

    try {
      const metadata = await fetchOgMetadata(url);
      setMeta(metadata);
    } catch (err) {
      if (err instanceof OgFetchError) {
        setError(t.errors[err.code]);
      } else {
        setError(t.errors.generic);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 bg-[#050505] text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <Header />

        <form
          onSubmit={handleCheck}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.form.placeholder}
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/50 transition"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
          >
            {loading ? t.form.scanning : t.form.check}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="max-w-2xl mx-auto mb-8 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-red-300 text-sm text-center"
          >
            {error}
          </p>
        )}

        {meta && (
          <div className="space-y-8">
            <MetaPanel meta={meta} />
            <div className="grid gap-6 lg:grid-cols-2">
              <WhatsAppPreview meta={meta} />
              <TwitterPreview meta={meta} />
              <RedditPreview meta={meta} />
              <BlueskyPreview meta={meta} />
              <TelegramPreview meta={meta} />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}
