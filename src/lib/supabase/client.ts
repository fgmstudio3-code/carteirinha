import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para uso no browser (Client Components).
 * As chaves vêm de variáveis de ambiente públicas (NEXT_PUBLIC_*),
 * seguras para expor no front-end porque a segurança real é
 * garantida pelas políticas de Row Level Security (RLS) no banco.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
