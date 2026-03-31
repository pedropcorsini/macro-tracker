# 🥗 Macro Tracker — App React + Supabase

App web para acompanhamento de nutrição diária com registro de refeições, controle de macronutrientes, hidratação e histórico por calendário.
**Versão 1.0 — com banco de dados real via Supabase, autenticação e suporte a modo escuro/claro.**

---

## 🚀 Como Configurar

### 1. Clone o projeto e instale as dependências

```bash
git clone https://github.com/pedropcorsini/macro-tracker.git
cd macro-tracker
npm install
```

---

### 2. Configure o Supabase

#### 2.1 Crie uma conta gratuita

Acesse **https://supabase.com** e crie uma conta (gratuita).

#### 2.2 Crie um novo projeto

- Clique em **"New project"**
- Escolha um nome (ex: `macro-tracker`)
- Defina uma senha para o banco
- Selecione a região mais próxima (ex: South America — São Paulo)

#### 2.3 Execute o schema SQL

- No painel do Supabase, vá em **SQL Editor → New query**
- Cole e execute o seguinte SQL:

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  goals jsonb default '{"cal":2000,"p":150,"c":200,"f":65,"water":2500,"cupMl":250,"waterUnit":"ml"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  meals jsonb default '{}'::jsonb,
  water_ml integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, date)
);

alter table profiles enable row level security;
alter table daily_logs enable row level security;

create policy "Users can manage own profile"
  on profiles for all using (auth.uid() = id);

create policy "Users can manage own logs"
  on daily_logs for all using (auth.uid() = user_id);
```

#### 2.4 Copie as credenciais

- Vá em **Project Settings → API**
- Copie:
  - **Project URL** → `https://SEU_PROJETO.supabase.co`
  - **anon public key** → chave longa começando com `eyJ...`

#### 2.5 Configure os provedores de login (opcional)

Para habilitar login com **Google** e **GitHub**, vá em **Authentication → Providers** e ative cada provedor, seguindo as instruções do Supabase para obter as credenciais OAuth de cada plataforma.

---

### 3. Configure a API de Alimentos (USDA)

O app usa a API gratuita do USDA FoodData Central para buscar alimentos.

- Acesse **https://fdc.nal.usda.gov/api-key-signup.html**
- Preencha o formulário e aguarde o e-mail com a sua chave

---

### 4. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com as seguintes variáveis:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...SUA_CHAVE_AQUI
VITE_USDA_API_KEY=SUA_CHAVE_USDA_AQUI
```

> ⚠️ Nunca commite o arquivo `.env` no git. Ele já está listado no `.gitignore`.

---

### 5. Rode o projeto

```bash
npm run dev
# Acesse http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
macro-tracker/
├── public/
├── .env                          ← Suas credenciais (NÃO commitar!)
├── .env.example                  ← Template das variáveis de ambiente
├── index.html
└── src/
    ├── context/
    │   ├── TrackerContext.jsx    ← Estado global + sync com Supabase
    │   └── ThemeContext.jsx      ← Controle de tema claro/escuro
    ├── data/
    │   └── foods.js              ← Banco local de alimentos em PT-BR
    ├── pages/
    │   ├── Hoje.jsx              ← Registro de refeições e hidratação
    │   ├── Calendario.jsx        ← Histórico por calendário
    │   ├── Metas.jsx             ← Configuração de metas diárias
    │   └── Login.jsx             ← Autenticação
    ├── services/
    │   ├── supabase.js           ← Cliente Supabase
    │   ├── db.js                 ← Funções de leitura/escrita no banco
    │   └── usda.js               ← Integração com API USDA
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas criadas

| Tabela | Descrição |
|---|---|
| `profiles` | Metas e preferências do usuário |
| `daily_logs` | Refeições e consumo de água por dia |

### Segurança (RLS)

Todas as tabelas têm **Row Level Security** ativado — cada usuário acessa somente seus próprios dados.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — login com e-mail/senha, Google e GitHub via Supabase
- 🍽️ **Registro de refeições** — café da manhã, almoço, lanche da tarde e jantar
- 🔍 **Busca de alimentos** — banco local em PT-BR + API USDA com 300k+ itens
- ⚖️ **Entrada por gramas ou unidade** — ovos, fatias de pão, frutas e mais
- 💧 **Controle de hidratação** — meta de copos, input manual e suporte a ml/L
- 📊 **Macros em tempo real** — calorias, proteína, carboidratos e gordura
- 📅 **Calendário de histórico** — visualize seus dias com indicadores coloridos
- 🎯 **Metas personalizadas** — defina seus próprios objetivos diários
- ☁️ **Sincronização na nuvem** — tudo salvo no Supabase por usuário
- 🌙 **Modo escuro/claro** — segue o sistema ou escolha manualmente
- 📱 **Responsivo** — funciona bem em celular, tablet e desktop

---

## 🔧 Tecnologias

- **React 18** — UI declarativa com hooks
- **Vite** — bundler rápido para desenvolvimento
- **Tailwind CSS** — estilização com suporte a dark mode
- **Supabase** — banco PostgreSQL + autenticação + RLS
- **USDA FoodData Central API** — base de dados de alimentos

---

## 🌐 Deploy (Vercel)

1. Acesse **https://vercel.com** e conecte sua conta do GitHub
2. Importe o repositório `macro-tracker`
3. Em **Environment Variables**, adicione as três variáveis do `.env`
4. Clique em **Deploy**

A cada `git push`, o Vercel refaz o deploy automaticamente.

---

## 🔒 Segurança

- Nunca commite o arquivo `.env` no git
- A `anon key` do Supabase é segura para uso no frontend (o RLS protege os dados)
- A chave da API USDA é gratuita e possui limite generoso de requisições
