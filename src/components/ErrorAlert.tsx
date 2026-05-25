"use client";

import { useId, useState } from "react";
import { useI18n } from "@/i18n/context";
import type { FetchErrorCode } from "@/lib/fetch-errors";

interface ErrorAlertProps {
  code: FetchErrorCode;
  message: string;
}

function ErrorHelpButton({ code }: { code: FetchErrorCode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const popoverId = useId();
  const help = t.errorHelp[code];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-red-700/60 bg-red-950/60 text-red-200 text-sm font-bold hover:bg-red-900/80 hover:border-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500/50"
        aria-label={t.errorHelp.label}
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
      >
        ?
      </button>

      <div
        id={popoverId}
        role="tooltip"
        className={`absolute z-20 right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-left shadow-xl transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <p className="text-sm font-semibold text-neutral-100">{help.title}</p>
        <p className="mt-2 text-xs text-neutral-400 leading-relaxed">{help.body}</p>
      </div>
    </div>
  );
}

export function ErrorAlert({ code, message }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="max-w-2xl mx-auto mb-8 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 text-red-300 text-center sm:text-left">{message}</p>
        <ErrorHelpButton code={code} />
      </div>
    </div>
  );
}
