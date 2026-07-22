"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/lib/actions/auth";
import { FormField, SubmitButton, FormMessage } from "@/components/auth-ui";

const initialState: AuthState = {};

export default function RedefinirSenhaPage() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <>
      <p className="mb-5 text-sm text-slate-400">Defina sua nova senha.</p>
      <FormMessage error={state.error} success={state.success} />
      <form action={formAction}>
        <FormField
          label="Nova senha"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          required
        />
        <FormField
          label="Confirmar nova senha"
          type="password"
          name="confirmarSenha"
          autoComplete="new-password"
          placeholder="Repita a senha"
          minLength={8}
          required
        />
        <div className="mt-2">
          <SubmitButton pending={pending}>Salvar nova senha</SubmitButton>
        </div>
      </form>
    </>
  );
}
