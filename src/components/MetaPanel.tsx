"use client";

import type { OgMetadata } from "@/lib/og-parser";
import { displayDescription, displayImage, displayTitle } from "@/lib/og-parser";

interface MetaPanelProps {
  meta: OgMetadata;
}

function MetaRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 py-2 border-b border-neutral-800 last:border-0 text-sm">
      <span className="text-neutral-500 font-mono text-xs">{label}</span>
      <span className="text-neutral-200 break-all">{value}</span>
    </div>
  );
}

export function MetaPanel({ meta }: MetaPanelProps) {
  const rows: { label: string; value: string | null }[] = [
    { label: "og:title", value: meta.title },
    { label: "og:description", value: meta.description },
    { label: "og:image", value: meta.image },
    { label: "og:site_name", value: meta.siteName },
    { label: "og:type", value: meta.type },
    { label: "twitter:card", value: meta.twitterCard },
    { label: "twitter:title", value: meta.twitterTitle },
    { label: "twitter:description", value: meta.twitterDescription },
    { label: "twitter:image", value: meta.twitterImage },
    { label: "canonical", value: meta.canonical },
    { label: "URL finale", value: meta.url },
  ];

  const effective = {
    title: displayTitle(meta),
    description: displayDescription(meta),
    image: displayImage(meta),
  };

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden">
      <header className="px-4 py-3 border-b border-neutral-800">
        <h2 className="font-semibold text-neutral-100">Métadonnées extraites</h2>
        <p className="text-xs text-neutral-500 mt-1">Valeurs utilisées pour les previews ci-dessous</p>
      </header>
      <div className="p-4 space-y-4">
        <div className="rounded-lg bg-neutral-950 p-3 text-sm">
          <p>
            <span className="text-neutral-500">Titre effectif :</span>{" "}
            <span className="text-emerald-400">{effective.title}</span>
          </p>
          {effective.description && (
            <p className="mt-2">
              <span className="text-neutral-500">Description :</span>{" "}
              <span className="text-neutral-300">{effective.description}</span>
            </p>
          )}
          {effective.image && (
            <p className="mt-2">
              <span className="text-neutral-500">Image :</span>{" "}
              <a
                href={effective.image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline break-all"
              >
                {effective.image}
              </a>
            </p>
          )}
        </div>
        <div>{rows.map((r) => (
          <MetaRow key={r.label} label={r.label} value={r.value} />
        ))}</div>
      </div>
    </section>
  );
}
