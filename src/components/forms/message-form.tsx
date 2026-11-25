"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

import { submitMessage } from "@/actions/public";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <span className="field-error" id={id}>
      {messages[0]}
    </span>
  );
}

export function MessageForm({
  kind = "contact",
  subjects,
  defaultSubject,
  resetHref,
}: {
  kind?: "contact" | "prestation";
  subjects: readonly string[];
  defaultSubject?: string;
  resetHref: string;
}) {
  const [state, formAction] = useActionState(submitMessage, initialState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};
  const selected =
    defaultSubject && subjects.includes(defaultSubject)
      ? defaultSubject
      : (values.subject ?? subjects[0]);

  if (state.ok) {
    return (
      <div className="form-card">
        <div className="alert alert-success" role="status">
          <CheckCircle2 size={19} aria-hidden="true" />
          <span>{state.message}</span>
        </div>
        <h3 style={{ marginTop: 8 }}>Message enregistré</h3>
        <p className="lead" style={{ marginTop: 8, fontSize: "0.92rem" }}>
          L&apos;administration dispose maintenant de votre demande. Si vous avez
          indiqué une adresse email, un accusé de réception vous a été envoyé.
        </p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <Link className="btn btn-outline" href={resetHref}>
            Envoyer un autre message
          </Link>
          <Link className="btn" href="/">
            Retour à l&apos;accueil
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" action={formAction} noValidate>
      <input type="hidden" name="type" value={kind} />

      {state.message && !state.ok ? (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Votre nom</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={values.name ?? ""}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
          />
          <FieldError id="name-error" messages={errors.name} />
        </div>

        <div className="field">
          <label htmlFor="phone">
            Téléphone <span className="optional">(recommandé)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01 00 00 00 00"
            defaultValue={values.phone ?? ""}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
          />
          <span className="field-hint" id="phone-hint">
            Pour une réponse rapide par appel ou WhatsApp.
          </span>
          <FieldError id="phone-error" messages={errors.phone} />
        </div>

        <div className="field field-full">
          <label htmlFor="email">
            Adresse email <span className="optional">(recommandé)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            defaultValue={values.email ?? ""}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : "email-hint"}
          />
          <span className="field-hint" id="email-hint">
            Laissez au moins un email ou un téléphone pour recevoir une réponse.
          </span>
          <FieldError id="email-error" messages={errors.email} />
        </div>

        <div className="field field-full">
          <label htmlFor="subject">
            {kind === "prestation" ? "Prestation souhaitée" : "Sujet de votre message"}
          </label>
          <select
            id="subject"
            name="subject"
            defaultValue={selected}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            required
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <FieldError id="subject-error" messages={errors.subject} />
        </div>

        <div className="field field-full">
          <label htmlFor="message">Votre message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={2000}
            placeholder={
              kind === "prestation"
                ? "Précisez votre besoin et les documents dont vous disposez déjà."
                : "Décrivez votre demande en quelques lignes."
            }
            defaultValue={values.message ?? ""}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            required
          />
          <FieldError id="message-error" messages={errors.message} />
        </div>

        <div className="field field-full">
          <label className="checkbox-field" htmlFor="consent-message">
            <input id="consent-message" name="consent" type="checkbox" defaultChecked />
            <span>
              J&apos;accepte l&apos;utilisation de ces informations pour traiter ma
              demande. Voir{" "}
              <Link href="/confidentialite" className="table-link">
                la politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <FieldError id="consent-message-error" messages={errors.consent} />
        </div>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website-message">Site internet</label>
        <input
          id="website-message"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-actions">
        <SubmitButton pendingLabel="Envoi…">
          Envoyer le message
          <ArrowRight size={16} aria-hidden="true" />
        </SubmitButton>
        <span className="form-note" style={{ marginTop: 0 }}>
          Réponse par email ou par téléphone.
        </span>
      </div>
    </form>
  );
}
