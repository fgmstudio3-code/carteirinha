import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome_completo")
    .eq("id", user!.id)
    .single();

  const primeiroNome = profile?.nome_completo?.split(" ")[0] || "aluno(a)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Olá, {primeiroNome}!</h1>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Sair
            </button>
          </form>
        </div>
        <p className="mt-4 text-slate-400">
          Login funcionando. O dashboard completo (perfil, financeiro e
          carteirinha) chega no próximo bloco.
        </p>
      </div>
    </div>
  );
}
