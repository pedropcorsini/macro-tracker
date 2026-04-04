# 🥗 Macro Tracker — Web App

App web completo para acompanhamento de nutrição diária com registro de refeições, controle de macronutrientes, hidratação, histórico por calendário e gráficos de evolução.
**Versão 1.0 — autenticação real, banco de dados na nuvem via Supabase e suporte a modo escuro/claro.**

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI e gerenciamento de estado |
| Vite | 5 | Bundler e dev server |
| Tailwind CSS | 3 | Estilização com suporte a dark mode |
| Supabase | — | Banco PostgreSQL + autenticação + RLS |
| Recharts | — | Gráficos de barras semanais e mensais |
| USDA FoodData Central API | — | Base de dados com 300k+ alimentos |
| Google Fonts | — | Fonte Bungee no título |

---

## Início rápido

```bash
# 1. Clonar o repositório
git clone https://github.com/pedropcorsini/macro-tracker.git
cd macro-tracker

# 2. Instalar dependências
npm install

# 3. Criar o arquivo de variáveis de ambiente
# (veja a seção "Variáveis de ambiente" abaixo)

# 4. Rodar em modo desenvolvimento
npm run dev
# → http://localhost:5173

# 5. Build de produção
npm run build
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...SUA_CHAVE_AQUI
VITE_USDA_API_KEY=SUA_CHAVE_USDA_AQUI
```

> ⚠️ O arquivo `.env` já está no `.gitignore` — nunca suba suas chaves para o GitHub.

---

## Configurar o Supabase

### 1. Criar uma conta gratuita

Acesse **https://supabase.com** e crie um projeto (gratuito).

### 2. Executar o schema SQL

No painel do Supabase, vá em **SQL Editor → New query**, cole e execute:

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

create table favoritos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  items jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table profiles enable row level security;
alter table daily_logs enable row level security;
alter table favoritos enable row level security;

create policy "Users can manage own profile"
  on profiles for all using (auth.uid() = id);

create policy "Users can manage own logs"
  on daily_logs for all using (auth.uid() = user_id);

create policy "Users can manage own favoritos"
  on favoritos for all using (auth.uid() = user_id);
```

### 3. Copiar as credenciais

Vá em **Project Settings → API** e copie o **Project URL** e a **anon public key**.

### 4. Ativar provedores de login (opcional)

Em **Authentication → Providers**, ative Google e/ou GitHub seguindo as instruções do Supabase para obter as credenciais OAuth de cada plataforma.

---

## Configurar a API de Alimentos (USDA)

O app busca alimentos na base do USDA FoodData Central — gratuita e com mais de 300 mil itens.

1. Acesse **https://fdc.nal.usda.gov/api-key-signup.html**
2. Preencha o formulário
3. Aguarde o e-mail com sua chave e cole no `.env`

> A busca prioriza o banco local em português. A API USDA é usada como complemento quando nenhum resultado local é encontrado.

---

## Estrutura de pastas

```
macro-tracker/
├── public/
├── .env                              ← Suas credenciais (NÃO commitar!)
├── index.html
└── src/
    ├── components/
    │   └── AlimentosRapidos.jsx      ← Acesso rápido a recentes/favoritos/top
    ├── context/
    │   ├── TrackerContext.jsx        ← Estado global + sync com Supabase
    │   └── ThemeContext.jsx          ← Controle de tema claro/escuro
    ├── data/
    │   └── foods.js                  ← Banco local com 80+ alimentos em PT-BR
    ├── pages/
    │   ├── Hoje.jsx                  ← Registro de refeições e hidratação
    │   ├── Calendario.jsx            ← Histórico por calendário
    │   ├── Metas.jsx                 ← Configuração de metas diárias
    │   ├── Graficos.jsx              ← Gráficos semanais e mensais
    │   ├── Favoritos.jsx             ← Alimentos favoritos, recentes e mais usados
    │   └── Login.jsx                 ← Autenticação
    ├── services/
    │   ├── supabase.js               ← Cliente Supabase
    │   ├── db.js                     ← Funções de leitura/escrita no banco
    │   └── usda.js                   ← Integração com API USDA
    ├── App.jsx                       ← Shell com sidebar + roteamento
    ├── main.jsx                      ← Entry point
    └── index.css                     ← Tailwind base + dark mode
```

---

## Funcionalidades

### Páginas disponíveis

| Página | Descrição |
|---|---|
| **Hoje** | Registra refeições por período do dia, controla hidratação e exibe macros em tempo real |
| **Calendário** | Visualiza o histórico com indicadores coloridos por dia |
| **Metas** | Define objetivos diários de calorias, proteína, carbs, gordura e água |
| **Gráficos** | Barras semanais e mensais com linha de meta para cada macro |
| **Favoritos** | Acesso rápido a alimentos marcados com ♥, recentes e mais usados |

### Registro de refeições

| Refeição | Período |
|---|---|
| Café da manhã | Manhã |
| Almoço | Meio-dia |
| Lanche da tarde | Tarde |
| Jantar | Noite |

- Busca em banco local (PT-BR) com fallback automático para API USDA
- Entrada por **gramas** ou **unidade** (ovos, fatias, frutas, etc.)
- Preview de macros em tempo real antes de adicionar
- Painel lateral com resumo por refeição e total do dia

### Controle de hidratação

- Copos clicáveis baseados na meta e no tamanho do copo configurado
- Input manual em **ml** ou **L**
- Barra de progresso e indicador de quanto falta para a meta
- Botão para zerar o registro do dia

### Banco local de alimentos (PT-BR)

80+ alimentos organizados por categoria, com dados por 100g:

| Categoria | Exemplos |
|---|---|
| Carnes e proteínas | Peito de frango, atum, salmão, ovo, whey |
| Carboidratos e grãos | Arroz branco/integral, feijão, aveia, batata-doce, tapioca |
| Frutas | Banana, maçã, mamão, manga, morango, abacate |
| Laticínios | Iogurte grego, queijo cottage, leite integral, requeijão |
| Vegetais | Brócolis, espinafre, cenoura, couve, beterraba |
| Gorduras | Azeite, pasta de amendoim, amêndoas, castanha-do-pará |
| Bebidas | Suco de laranja, leite de aveia, café, chá verde |

---

## Banco de dados (Supabase)

### Tabelas

| Tabela | Descrição |
|---|---|
| `profiles` | Metas e preferências do usuário |
| `daily_logs` | Refeições e consumo de água por dia |
| `favoritos` | Lista de alimentos favoritos por usuário |

### Segurança (RLS)

Todas as tabelas têm **Row Level Security** ativado — cada usuário acessa somente seus próprios dados. A `anon key` do Supabase é segura para uso no frontend.

---

## Responsividade

| Dispositivo | Layout |
|---|---|
| Desktop (≥ 1024px) | Sidebar fixa 224px + conteúdo principal com scroll independente |
| Tablet / Mobile (< 1024px) | Topbar com botão hamburger ☰ que abre sidebar deslizante + overlay escuro |

---

## Tema claro / escuro

O tema segue automaticamente o sistema operacional do dispositivo no primeiro acesso. O usuário pode alternar manualmente pelo botão na sidebar (desktop) ou na topbar (mobile). A preferência é salva no `localStorage`.

---

## Deploy no Vercel

```bash
# 1. Subir o código para o GitHub
git add .
git commit -m "feat: macro tracker"
git push origin main

# 2. Acessar vercel.com e importar o repositório
# → Framework Preset: Vite
# → Build Command: npm run build
# → Output Directory: dist

# 3. Em "Environment Variables", adicionar as 3 variáveis do .env

# 4. Clicar em Deploy
```

A cada `git push`, o Vercel refaz o deploy automaticamente.

---

## Personalização

### Adicionar alimentos ao banco local

Em `src/data/foods.js`, adicione um novo objeto ao array:

```js
{ id: 81, name: "Nome do alimento", cal: 000, p: 00, c: 00, f: 00 }
```

Para alimentos com unidade (ovo, fatia, fruta):

```js
{ id: 82, name: "Ovo de codorna", cal: 158, p: 13, c: 0.4, f: 11, unit: "unidade", gramsPerUnit: 10 }
```

### Alterar metas padrão

Em `src/context/TrackerContext.jsx`, edite o objeto `initialState.goals`:

```js
goals: { cal: 2500, p: 180, c: 250, f: 70, water: 3000, cupMl: 300, waterUnit: "ml" }
```

### Alterar cores do tema

Em `tailwind.config.js`, edite as cores em `theme.extend.colors`:

```js
colors: {
  accent: "#8b5cf6",   // violeta principal
  surface: "#1a1a1a",  // fundo dos cards (dark)
}
```

---

## Segurança

- Nunca commite o arquivo `.env` no git
- A `anon key` do Supabase é segura para uso no frontend (RLS protege os dados)
- A chave da API USDA é gratuita com limite de 1.000 requisições/hora
- Login com Google e GitHub usa OAuth via Supabase — nenhuma senha é armazenada localmente

---

## Licença

Projeto desenvolvido para fins de portfólio. Todos os direitos reservados.
