# Central do Aluno — Bloco 1: Setup

Este é o esqueleto inicial do projeto: Next.js configurado para conversar
com o Supabase, com middleware de proteção de rotas, headers de segurança
e o schema do banco pronto (com Row Level Security).

## O que já está pronto neste bloco

- Projeto Next.js (TypeScript + Tailwind) criado
- Cliente Supabase configurado (browser e servidor)
- Middleware que: renova sessão, bloqueia acesso a rotas protegidas sem
  login, e adiciona headers de segurança em toda resposta
- `supabase/schema.sql`: tabelas `profiles` e `pagamentos`, com RLS
  habilitado (cada usuário só acessa os próprios dados) e bucket de
  storage para fotos de perfil
- Headers de segurança globais (HSTS, CSP, anti-clickjacking) no
  `next.config.ts`

## Passo a passo

### 1. Criar o projeto no Supabase
1. Crie conta em https://supabase.com (grátis)
2. Crie um novo projeto
3. Vá em **SQL Editor** > cole o conteúdo de `supabase/schema.sql` > **Run**
4. Vá em **Project Settings > API** e copie:
   - `Project URL`
   - `anon public key`

### 2. Configurar variáveis de ambiente
1. Duplique o arquivo `.env.local.example` e renomeie a cópia para
   `.env.local`
2. Cole a URL e a chave que você copiou no passo anterior

### 3. Rodar localmente (opcional, pra testar antes de publicar)
```
npm install
npm run dev
```
Abre em http://localhost:3000

### 4. Subir para o GitHub
1. Crie uma conta em https://github.com (grátis)
2. Crie um repositório novo (pode ser privado)
3. Suba esta pasta (via GitHub Desktop, ou upload direto pelo navegador
   se preferir sem usar linha de comando)

### 5. Publicar na Vercel
1. Crie conta em https://vercel.com com login do GitHub
2. Importe o repositório
3. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local`
4. Deploy — a Vercel te dá a URL pública (`.vercel.app`)

## Segurança incluída neste bloco

- **RLS no banco**: cada aluno só enxerga os próprios dados (perfil e
  financeiro), mesmo que alguém inspecione o código do site e ache a
  chave pública da API
- **Sessão em cookie HTTP-only**: o token de login não fica acessível
  via JavaScript, dificultando roubo de sessão via XSS
- **Rotas protegidas no middleware**: `/dashboard`, `/perfil`,
  `/financeiro`, `/carteirinha`, `/configuracoes` exigem login
- **Headers HTTP**: HSTS (força HTTPS), CSP (restringe origem de
  scripts), X-Frame-Options (bloqueia clickjacking)
- **Rate limiting de login**: já incluso por padrão no Supabase Auth
  (bloqueia tentativas excessivas de login/cadastro), sem precisar
  configurar nada

## Próximo bloco

Bloco 2: telas de login, cadastro e recuperação de senha usando o
Supabase Auth.
