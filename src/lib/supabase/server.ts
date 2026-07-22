import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso no servidor (Server Components, Route Handlers,
 * Server Actions). Lê/escreve a sessão do usuário via cookies HTTP-only,
 * o que evita que o token de sessão fique acessível via JavaScript no
 * navegador (proteção contra roubo de sessão via XSS).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // O método `setAll` foi chamado a partir de um Server Component.
            // Pode ser ignorado se houver um middleware atualizando a sessão.
          }
        },
      },
    }
  );
}
