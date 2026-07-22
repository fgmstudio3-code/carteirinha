-- ============================================================
-- CENTRAL DO ALUNO — SCHEMA DO BANCO DE DADOS (Supabase/Postgres)
-- ============================================================
-- Como rodar: Supabase Dashboard > SQL Editor > colar este arquivo > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABELA DE PERFIS
-- ------------------------------------------------------------
-- auth.users (tabela interna do Supabase) já guarda e-mail/senha.
-- Esta tabela guarda os dados adicionais de cada aluno.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome_completo text not null,
  cpf text,
  ra text check (ra ~ '^[0-9]{7}$'), -- exige exatamente 7 dígitos numéricos
  curso text,
  faculdade text,
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. TABELA FINANCEIRA
-- ------------------------------------------------------------
create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  mes_referencia date not null, -- sempre dia 1 do mês, ex: 2026-06-01
  status text not null check (status in ('pago', 'pendente', 'atrasado')),
  data_pagamento date,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------
-- Isso é a proteção mais importante do projeto: sem RLS habilitado,
-- a chave pública (anon key) do front-end permitiria, em tese, que
-- qualquer usuário autenticado consultasse a tabela inteira e visse
-- dados de TODOS os alunos. Com RLS, o próprio Postgres bloqueia
-- isso — cada usuário só enxerga a própria linha.

alter table public.profiles enable row level security;
alter table public.pagamentos enable row level security;

-- Perfil: usuário só vê e edita o próprio registro
create policy "usuario_ve_proprio_perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "usuario_edita_proprio_perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "usuario_cria_proprio_perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Financeiro: usuário só vê os próprios pagamentos (nunca edita/insere
-- pelo próprio front-end — isso deve ser feito futuramente só por um
-- painel administrativo/backend, nunca pelo aluno)
create policy "usuario_ve_proprio_financeiro"
  on public.pagamentos for select
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. TRIGGER: criar perfil automaticamente ao cadastrar usuário
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_completo)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome_completo', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 5. STORAGE: bucket para fotos de perfil
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos-perfil', 'fotos-perfil', true)
on conflict (id) do nothing;

-- Só o dono pode subir/atualizar sua própria foto (nome do arquivo = user_id)
create policy "usuario_faz_upload_propria_foto"
  on storage.objects for insert
  with check (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "usuario_atualiza_propria_foto"
  on storage.objects for update
  using (
    bucket_id = 'fotos-perfil'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Leitura pública (necessário pra foto aparecer na carteirinha/preview)
create policy "leitura_publica_fotos"
  on storage.objects for select
  using (bucket_id = 'fotos-perfil');
