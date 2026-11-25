"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  className = "btn",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? (
        <Loader2 size={16} className="spin" aria-hidden="true" />
      ) : null}
      {pending ? (pendingLabel ?? "Envoi en cours…") : children}
    </button>
  );
}
