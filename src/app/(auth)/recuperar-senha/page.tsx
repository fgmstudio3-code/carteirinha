"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";
import { FormField, SubmitButton, FormMessage, AuthLinks } from "@/components/auth-ui";

const initialState: AuthState = {};

export default function RecuperarSenhaPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <>
      <p className="mb-5 text-sm text-slate-400">
        Informe seu e-mail. Se houver uma conta cadastrada, enviaremos um
        link para você redefinir sua senha.
      </p>
      <FormMessage error={state.error} success={state.success} />
      {!state.success && (
        <form action={formAction}>
          <FormField
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="seu@email.com"
            required
          />
          <div className="mt-2">
            <SubmitButton pending={pending}>Enviar link de recuperação</SubmitButton>
          </div>
        </form>
      )}
      <AuthLinks links={[{ label: "Voltar para o login", href: "/login" }]} />
    </>
  );
}
