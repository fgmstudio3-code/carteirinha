"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ------------------------------------------------------------
// LOGIN
// ------------------------------------------------------------
export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Mensagem genérica de propósito: não revela se o e-mail existe ou
    // não na base, o que ajuda a dificultar tentativas de enumeração
    // de contas por um atacante.
    return { error: "E-mail ou senha inválidos." };
  }

  redirect("/dashboard");
}

// ------------------------------------------------------------
// CADASTRO
// ------------------------------------------------------------
export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const nomeCompleto = String(formData.get("nomeCompleto") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmarSenha = String(formData.get("confirmarSenha") || "");

  if (!nomeCompleto || !email || !password || !confirmarSenha) {
    return { error: "Preencha todos os campos." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "E-mail inválido." };
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirmarSenha) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome_completo: nomeCompleto }, // usado pela trigger handle_new_user
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já possui cadastro." };
    }
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  return {
    success:
      "Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.",
  };
}

// ------------------------------------------------------------
// LOGOUT
// ------------------------------------------------------------
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ------------------------------------------------------------
// SOLICITAR RECUPERAÇÃO DE SENHA
// ------------------------------------------------------------
export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: "Informe um e-mail válido." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/redefinir-senha`,
  });

  // Sempre retorna a mesma mensagem de sucesso, exista ou não o e-mail
  // na base — isso evita que alguém use este formulário para descobrir
  // quais e-mails têm conta no sistema (enumeração de usuários).
  return {
    success:
      "Se este e-mail estiver cadastrado, você receberá um link de recuperação.",
  };
}

// ------------------------------------------------------------
// DEFINIR NOVA SENHA (após clicar no link do e-mail)
// ------------------------------------------------------------
export async function updatePassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") || "");
  const confirmarSenha = String(formData.get("confirmarSenha") || "");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirmarSenha) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Não foi possível atualizar a senha. Solicite um novo link." };
  }

  redirect("/dashboard");
}
