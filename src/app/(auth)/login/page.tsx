"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/lib/actions/auth";
import { FormField, SubmitButton, FormMessage, AuthLinks } from "@/components/auth-ui";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <>
      <FormMessage error={state.error} success={state.success} />
      <form action={formAction}>
        <FormField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seu@email.com"
          required
        />
        <FormField
          label="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <div className="mt-2">
          <SubmitButton pending={pending}>Entrar</SubmitButton>
        </div>
      </form>
      <AuthLinks
        links={[
          { label: "Esqueci minha senha", href: "/recuperar-senha" },
          { label: "Criar conta", href: "/cadastro" },
        ]}
      />
    </>
  );
}
