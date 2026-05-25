"use client";

import { FormEvent, useState } from "react";
import type { OgMetadata } from "@/lib/og-parser";
import { MetaPanel } from "@/components/MetaPanel";
import {
  BlueskyPreview,
  RedditPreview,
  TelegramPreview,
  TwitterPreview,
  WhatsAppPreview,
} from "@/components/platform-previews";

export default function Home() {
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
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors du scan.");
        return;
      }
      setMeta(data.metadata);
    } catch {
      setError("Impossible de contacter le serveur local.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Check <span className="text-emerald-500">Thumbnail</span>
          </h1>
          <p className="mt-3 text-neutral-400 max-w-lg mx-auto text-sm sm:text-base">
            Collez une URL pour analyser les balises Open Graph et Twitter Card, puis
            visualisez le rendu sur WhatsApp, X, Reddit, Bluesky et Telegram.
          </p>
        </header>

        <form
          onSubmit={handleCheck}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemple.com/article"
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-base text-neutral-100 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/50 transition"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
          >
            {loading ? "Scan…" : "Check"}
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
      </div>
    </main>
  );
}
