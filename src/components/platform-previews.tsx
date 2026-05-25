"use client";

import type { OgMetadata } from "@/lib/og-parser";
import {
  displayDescription,
  displayImage,
  displayTitle,
  hostname,
} from "@/lib/og-parser";
import { PreviewImage } from "./PreviewImage";

interface PlatformPreviewProps {
  meta: OgMetadata;
}

function PlatformCard({
  name,
  icon,
  accent,
  children,
}: {
  name: string;
  icon: React.ReactNode;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden">
      <header
        className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800"
        style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-lg">
          {icon}
        </span>
        <h2 className="font-semibold text-neutral-100">{name}</h2>
      </header>
      <div className="p-4 flex justify-center bg-[#0a0a0a]">{children}</div>
    </section>
  );
}

export function WhatsAppPreview({ meta }: PlatformPreviewProps) {
  const title = displayTitle(meta);
  const desc = displayDescription(meta);
  const image = displayImage(meta);
  const domain = hostname(meta.url);

  return (
    <PlatformCard name="WhatsApp" icon="💬" accent="#25D366">
      <div className="w-full max-w-[340px] rounded-lg overflow-hidden bg-[#1f2c34] shadow-lg">
        {image && (
          <PreviewImage src={image} alt="" className="rounded-none" aspect="video" />
        )}
        <div className="px-3 py-2.5 border-t border-[#2a3942]">
          <p className="text-[15px] font-medium text-[#e9edef] line-clamp-2 leading-snug">
            {title}
          </p>
          {desc && (
            <p className="mt-1 text-[13px] text-[#8696a0] line-clamp-2 leading-snug">{desc}</p>
          )}
          <p className="mt-1.5 text-[12px] text-[#8696a0] uppercase tracking-wide truncate">
            {domain}
          </p>
        </div>
      </div>
    </PlatformCard>
  );
}

export function TwitterPreview({ meta }: PlatformPreviewProps) {
  const title = displayTitle(meta);
  const desc = displayDescription(meta);
  const image = displayImage(meta);
  const domain = hostname(meta.url);
  const card = meta.twitterCard ?? (image ? "summary_large_image" : "summary");

  const isLarge = card === "summary_large_image" || card === "player";

  return (
    <PlatformCard name="X (Twitter)" icon="𝕏" accent="#000000">
      <div className="w-full max-w-[506px] rounded-2xl border border-[#2f3336] overflow-hidden bg-black">
        {isLarge && image ? (
          <PreviewImage src={image} alt="" aspect="wide" className="rounded-none border-b border-[#2f3336]" />
        ) : null}
        <div className={`px-4 py-3 ${!isLarge && image ? "flex gap-3" : ""}`}>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] text-[#e7e9ea] line-clamp-1 font-normal">{title}</p>
            {desc && (
              <p className="mt-0.5 text-[15px] text-[#71767b] line-clamp-2">{desc}</p>
            )}
            <p className="mt-1 text-[15px] text-[#71767b]">{domain}</p>
          </div>
          {!isLarge && image && (
            <div className="w-[130px] shrink-0 rounded-xl overflow-hidden border border-[#2f3336]">
              <PreviewImage src={image} alt="" aspect="square" className="rounded-none" />
            </div>
          )}
        </div>
      </div>
    </PlatformCard>
  );
}

export function RedditPreview({ meta }: PlatformPreviewProps) {
  const title = displayTitle(meta);
  const image = displayImage(meta);
  const domain = hostname(meta.url);

  return (
    <PlatformCard name="Reddit" icon="🔴" accent="#FF4500">
      <div className="w-full max-w-[512px] rounded-md border border-[#343536] bg-[#1a1a1b] overflow-hidden flex">
        <div className="flex-1 min-w-0 px-3 py-2.5">
          <p className="text-[14px] font-medium text-[#d7dadc] hover:underline line-clamp-2 leading-snug">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-[#818384]">{domain}</p>
        </div>
        {image && (
          <div className="w-[108px] shrink-0 border-l border-[#343536]">
            <PreviewImage src={image} alt="" aspect="square" className="h-full min-h-[72px] rounded-none" />
          </div>
        )}
      </div>
    </PlatformCard>
  );
}

export function BlueskyPreview({ meta }: PlatformPreviewProps) {
  const title = displayTitle(meta);
  const desc = displayDescription(meta);
  const image = displayImage(meta);
  const domain = hostname(meta.url);

  return (
    <PlatformCard name="Bluesky" icon="🦋" accent="#0085ff">
      <div className="w-full max-w-[480px]">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0085ff]/20 shrink-0 flex items-center justify-center text-[#0085ff] text-sm font-bold">
            ?
          </div>
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border border-[#2d333b] overflow-hidden bg-[#16181c]">
              {image && <PreviewImage src={image} alt="" aspect="wide" className="rounded-none" />}
              <div className="px-3 py-2.5">
                <p className="text-[15px] font-medium text-[#e7e9ea] line-clamp-2">{title}</p>
                {desc && (
                  <p className="mt-0.5 text-[13px] text-[#8b949e] line-clamp-2">{desc}</p>
                )}
                <p className="mt-1 text-[12px] text-[#0085ff]">{domain}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PlatformCard>
  );
}

export function TelegramPreview({ meta }: PlatformPreviewProps) {
  const title = displayTitle(meta);
  const desc = displayDescription(meta);
  const image = displayImage(meta);
  const domain = hostname(meta.url);

  return (
    <PlatformCard name="Telegram" icon="✈️" accent="#2AABEE">
      <div className="w-full max-w-[360px] rounded-xl overflow-hidden bg-[#182533] shadow-md">
        {image && (
          <PreviewImage src={image} alt="" aspect="video" className="rounded-none max-h-[200px]" />
        )}
        <div className="px-3 py-2 border-t border-[#213040]">
          <p className="text-[15px] font-semibold text-[#6ab2f2] line-clamp-2">{title}</p>
          {desc && (
            <p className="mt-0.5 text-[14px] text-[#8ba3be] line-clamp-3 leading-snug">{desc}</p>
          )}
          <p className="mt-1 text-[13px] text-[#6ab2f2]/80">{domain}</p>
        </div>
      </div>
    </PlatformCard>
  );
}
