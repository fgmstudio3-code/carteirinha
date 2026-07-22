"use client";

import { useActionState } from "react";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { FormField, SubmitButton, FormMessage, AuthLinks } from "@/components/auth-ui";

const initialState: AuthState = {};

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <>
      <FormMessage error={state.error} success={state.success} />
      {!state.success && (
        <form action={formAction}>
          <FormField
            label="Nome completo"
            type="text"
            name="nomeCompleto"
            autoComplete="name"
            placeholder="Seu nome completo"
            required
          />
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
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
          />
          <FormField
            label="Confirmar senha"
            type="password"
            name="confirmarSenha"
            autoComplete="new-password"
            placeholder="Repita a senha"
            minLength={8}
            required
          />
          <div className="mt-2">
            <SubmitButton pending={pending}>Criar conta</SubmitButton>
          </div>
        </form>
      )}
      <AuthLinks links={[{ label: "Já tenho conta — entrar", href: "/login" }]} />
    </>
  );
}
