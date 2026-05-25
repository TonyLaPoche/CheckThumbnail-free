"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import type { ScanPhase, SlowReason } from "@/lib/fetch-og";

interface ScanProgressProps {
  progress: number;
  phase: ScanPhase;
  slowReason?: SlowReason;
}

export function ScanProgress({ progress, phase, slowReason }: ScanProgressProps) {
  const { t } = useI18n();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const target = Math.min(100, Math.max(0, progress));
    if (target <= displayProgress) {
      setDisplayProgress(target);
      return;
    }

    const step = () => {
      setDisplayProgress((current) => {
        if (current >= target) return target;
        const delta = Math.max(1, Math.ceil((target - current) / 8));
        return Math.min(target, current + delta);
      });
    };

    const id = window.setInterval(step, 40);
    return () => window.clearInterval(id);
  }, [progress, displayProgress]);

  const phaseLabel =
    phase === "slow_wait" && slowReason
      ? t.loading.slowReasons[slowReason]
      : t.loading.phases[phase];

  return (
    <div
      className="max-w-2xl mx-auto mb-8 rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-5 py-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-sm font-medium text-emerald-400">{t.loading.title}</p>
        <span className="text-sm font-mono tabular-nums text-emerald-300">
          {displayProgress}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-400 transition-[width] duration-150 ease-out relative overflow-hidden"
          style={{ width: `${displayProgress}%` }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </div>
      </div>

      <p
        className={`mt-3 text-xs flex items-start gap-2 ${
          phase === "slow_wait" ? "text-amber-400/90" : "text-neutral-400"
        }`}
      >
        <span className="inline-block h-3 w-3 mt-0.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0" />
        <span className="leading-relaxed">{phaseLabel}</span>
      </p>
    </div>
  );
}
