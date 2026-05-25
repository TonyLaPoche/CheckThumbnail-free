"use client";

import { useState } from "react";

interface PreviewImageProps {
  src: string | null;
  alt: string;
  className?: string;
  aspect?: "video" | "square" | "wide";
}

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[1.91/1]",
};

export function PreviewImage({ src, alt, className = "", aspect = "video" }: PreviewImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-200 text-neutral-500 text-xs ${aspectClass[aspect]} ${className}`}
      >
        Aucune image OG
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${aspectClass[aspect]} ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
