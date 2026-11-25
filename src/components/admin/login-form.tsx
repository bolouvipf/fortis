"use client";

import { useActionState } from "react";
import { AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";

import { loginAdmin } from "@/actions/admin";
import { SubmitButton } from "@/components/forms/submit-button";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function LoginForm() {
  const [state, action] = useActionState(loginAdmin, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={action}>
      {state.message ? (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      ) : null}

      <div className="field" style={{ marginBottom: 16 }}>
        <label htmlFor="email">Adresse email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@fortis.bj"
          defaultValue={state.values?.email ?? ""}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
        {errors.email?.[0] ? (
          <span className="field-error" id="email-error">
            {errors.email[0]}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          required
        />
        {errors.password?.[0] ? (
          <span className="field-error" id="password-error">
            {errors.password[0]}
          </span>
        ) : null}
      </div>

      <SubmitButton className="btn btn-block" pendingLabel="Connexion…">
        <Lock size={16} aria-hidden="true" />
        Se connecter
        <ArrowRight size={16} aria-hidden="true" />
      </SubmitButton>

      <p className="form-note" style={{ textAlign: "center" }}>
        <Mail size={13} aria-hidden="true" style={{ display: "inline", marginRight: 5 }} />
        Accès réservé. Les tentatives sont limitées et journalisées.
      </p>
    </form>
  );
}
