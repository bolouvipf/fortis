"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  approveQuittance,
  rejectQuittance,
  resendQuittanceEmail,
  type AdminActionState,
} from "@/actions/admin";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState: AdminActionState = { ok: false };

function Feedback({ state }: { state: AdminActionState }) {
  if (!state.message) return null;

  const className =
    state.tone === "error"
      ? "alert alert-error"
      : state.tone === "warning"
        ? "alert alert-warning"
        : "alert alert-success";

  const Icon =
    state.tone === "error"
      ? AlertCircle
      : state.tone === "warning"
        ? AlertTriangle
        : CheckCircle2;

  return (
    <div className={className} role="status">
      <Icon size={17} aria-hidden="true" />
      <span>{state.message}</span>
    </div>
  );
}

export function ApproveBox({ id }: { id: string }) {
  const [state, action] = useActionState(approveQuittance, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="admin-actions">
      <Feedback state={state} />
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton className="btn btn-block" pendingLabel="Validation et envoi…">
          <ShieldCheck size={16} aria-hidden="true" />
          Valider et envoyer la quittance
        </SubmitButton>
      </form>
      <p className="action-note">
        Un numéro unique est attribué, le PDF est généré avec le cachet, puis
        envoyé au client par email.
      </p>
    </div>
  );
}

export function RejectBox({ id }: { id: string }) {
  const [state, action] = useActionState(rejectQuittance, initialState);

  return (
    <div className="admin-actions">
      <Feedback state={state} />
      <details>
        <summary
          className="btn btn-danger btn-sm"
          style={{ listStyle: "none", display: "inline-flex" }}
        >
          <XCircle size={15} aria-hidden="true" />
          Refuser la demande
        </summary>
        <form action={action} style={{ marginTop: 12 }}>
          <input type="hidden" name="id" value={id} />
          <div className="field">
            <label htmlFor={`reason-${id}`}>Motif communiqué au client</label>
            <textarea
              id={`reason-${id}`}
              name="reason"
              rows={3}
              required
              minLength={5}
              placeholder="Exemple : le montant ne correspond pas au reçu de paiement."
            />
            <span className="field-hint">
              Le motif est envoyé par email au client. Restez précis et courtois.
            </span>
          </div>
          <SubmitButton className="btn btn-danger btn-sm" pendingLabel="Rejet…">
            Refuser et informer le client
          </SubmitButton>
        </form>
      </details>
    </div>
  );
}

export function ResendBox({ id }: { id: string }) {
  const [state, action] = useActionState(resendQuittanceEmail, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="admin-actions">
      <Feedback state={state} />
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton
          className="btn btn-outline btn-block"
          pendingLabel="Renvoi…"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Renvoyer l&apos;email au client
        </SubmitButton>
      </form>
    </div>
  );
}
