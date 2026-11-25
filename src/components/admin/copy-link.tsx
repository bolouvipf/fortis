"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="copy-row">
      <input value={value} readOnly aria-label="Lien de la quittance" />
      <button
        type="button"
        className="btn btn-sm btn-outline"
        onClick={copy}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check size={13} aria-hidden="true" />
            Copié
          </>
        ) : (
          <>
            <Copy size={13} aria-hidden="true" />
            Copier
          </>
        )}
      </button>
    </div>
  );
}
