"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, ArrowRight, Info, Lock, Mail } from "lucide-react";

import { submitQuittance } from "@/actions/public";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  formations,
  paymentMethods,
} from "@/lib/site";
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

export function QuittanceForm({
  defaultFormation = "",
}: {
  defaultFormation?: string;
}) {
  const [state, formAction] = useActionState(submitQuittance, initialState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form className="form-card" action={formAction} noValidate>
      <div aria-live="polite">
        {state.message && !state.ok ? (
          <div className="alert alert-error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{state.message}</span>
          </div>
        ) : null}
      </div>

      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="clientName">Nom et prénom, ou raison sociale</label>
          <input
            id="clientName"
            name="clientName"
            autoComplete="name"
            defaultValue={values.clientName ?? ""}
            aria-invalid={Boolean(errors.clientName)}
            aria-describedby={errors.clientName ? "clientName-error" : undefined}
            required
          />
          <FieldError id="clientName-error" messages={errors.clientName} />
        </div>

        <div className="field">
          <label htmlFor="clientEmail">Adresse email</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            defaultValue={values.clientEmail ?? ""}
            aria-invalid={Boolean(errors.clientEmail)}
            aria-describedby={errors.clientEmail ? "clientEmail-error" : "clientEmail-hint"}
            required
          />
          <span className="field-hint" id="clientEmail-hint">
            La quittance validée sera envoyée à cette adresse.
          </span>
          <FieldError id="clientEmail-error" messages={errors.clientEmail} />
        </div>

        <div className="field">
          <label htmlFor="clientPhone">Téléphone</label>
          <input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01 00 00 00 00"
            defaultValue={values.clientPhone ?? ""}
            aria-invalid={Boolean(errors.clientPhone)}
            aria-describedby={errors.clientPhone ? "clientPhone-error" : undefined}
            required
          />
          <FieldError id="clientPhone-error" messages={errors.clientPhone} />
        </div>

        <div className="field field-full">
          <label htmlFor="formation">Formation suivie</label>
          <input
            id="formation"
            name="formation"
            list="formations-list"
            autoComplete="off"
            placeholder="Choisissez ou saisissez l'intitulé"
            defaultValue={values.formation ?? defaultFormation}
            aria-invalid={Boolean(errors.formation)}
            aria-describedby={errors.formation ? "formation-error" : "formation-hint"}
            required
          />
          <datalist id="formations-list">
            {formations.map((formation) => (
              <option key={formation} value={formation} />
            ))}
          </datalist>
          <span className="field-hint" id="formation-hint">
            Exemple : Archicad, bureautique, utilisation des intelligences artificielles.
          </span>
          <FieldError id="formation-error" messages={errors.formation} />
        </div>

        <div className="field">
          <label htmlFor="periodStart">Début de la formation</label>
          <input
            id="periodStart"
            name="periodStart"
            type="date"
            defaultValue={values.periodStart ?? ""}
            aria-invalid={Boolean(errors.periodStart)}
            aria-describedby={errors.periodStart ? "periodStart-error" : undefined}
            required
          />
          <FieldError id="periodStart-error" messages={errors.periodStart} />
        </div>

        <div className="field">
          <label htmlFor="periodEnd">Fin de la formation</label>
          <input
            id="periodEnd"
            name="periodEnd"
            type="date"
            defaultValue={values.periodEnd ?? ""}
            aria-invalid={Boolean(errors.periodEnd)}
            aria-describedby={errors.periodEnd ? "periodEnd-error" : undefined}
            required
          />
          <FieldError id="periodEnd-error" messages={errors.periodEnd} />
        </div>

        <div className="field">
          <label htmlFor="amount">Montant payé (FCFA)</label>
          <input
            id="amount"
            name="amount"
            inputMode="numeric"
            placeholder="25 000"
            defaultValue={values.amount ?? ""}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : "amount-hint"}
            required
          />
          <span className="field-hint" id="amount-hint">
            Chiffres uniquement, sans virgule.
          </span>
          <FieldError id="amount-error" messages={errors.amount} />
        </div>

        <div className="field">
          <label htmlFor="paymentMethod">Mode de paiement</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            defaultValue={values.paymentMethod ?? "Espèces"}
            aria-invalid={Boolean(errors.paymentMethod)}
            aria-describedby={errors.paymentMethod ? "paymentMethod-error" : undefined}
            required
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <FieldError id="paymentMethod-error" messages={errors.paymentMethod} />
        </div>

        <div className="field">
          <label htmlFor="paymentDate">Date du paiement</label>
          <input
            id="paymentDate"
            name="paymentDate"
            type="date"
            max={today}
            defaultValue={values.paymentDate ?? ""}
            aria-invalid={Boolean(errors.paymentDate)}
            aria-describedby={errors.paymentDate ? "paymentDate-error" : undefined}
            required
          />
          <FieldError id="paymentDate-error" messages={errors.paymentDate} />
        </div>

        <div className="field">
          <label htmlFor="paymentRef">
            Référence du paiement <span className="optional">(facultatif)</span>
          </label>
          <input
            id="paymentRef"
            name="paymentRef"
            placeholder="N° de transaction Mobile Money"
            defaultValue={values.paymentRef ?? ""}
            aria-invalid={Boolean(errors.paymentRef)}
            aria-describedby={errors.paymentRef ? "paymentRef-error" : undefined}
          />
          <FieldError id="paymentRef-error" messages={errors.paymentRef} />
        </div>

        <div className="field field-full">
          <label htmlFor="notes">
            Précisions pour l&apos;administration{" "}
            <span className="optional">(facultatif)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={1000}
            placeholder="Une information utile pour vérifier votre paiement."
            defaultValue={values.notes ?? ""}
          />
          <FieldError id="notes-error" messages={errors.notes} />
        </div>

        <div className="field field-full">
          <label className="checkbox-field" htmlFor="consent">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              defaultChecked={false}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <span>
              J&apos;accepte que mes informations soient utilisées pour vérifier
              mon paiement et établir ma quittance. Voir{" "}
              <Link href="/confidentialite" className="table-link">
                la politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <FieldError id="consent-error" messages={errors.consent} />
        </div>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Site internet</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-actions">
        <SubmitButton pendingLabel="Enregistrement…">
          Envoyer ma demande
          <ArrowRight size={16} aria-hidden="true" />
        </SubmitButton>
        <span className="form-note" style={{ marginTop: 0 }}>
          <Lock size={13} aria-hidden="true" style={{ display: "inline", marginRight: 5 }} />
          Aucun paiement n&apos;est demandé sur ce site.
        </span>
      </div>

      <p className="form-note">
        <Info size={13} aria-hidden="true" style={{ display: "inline", marginRight: 5 }} />
        Votre demande est d&apos;abord vérifiée par l&apos;administration. Vous
        recevrez la quittance au format PDF par email après validation. Un
        accusé de réception vous est envoyé immédiatement.
      </p>
      <p className="form-note">
        <Mail size={13} aria-hidden="true" style={{ display: "inline", marginRight: 5 }} />
        Une question avant d&apos;envoyer ?{" "}
        <Link href="/contact" className="table-link">
          Écrivez à l&apos;administration
        </Link>
        .
      </p>
    </form>
  );
}
