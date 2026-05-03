# Macro Tracker

Aplicação web para acompanhamento nutricional diário, desenvolvida como projeto de portfólio estudantil/profissional. O app reúne autenticação, registro de refeições, metas, hidratação, favoritos, calendário, gráficos e suporte multilíngue em uma interface responsiva.

O projeto demonstra construção de uma SPA com React, persistência em nuvem com Supabase, internacionalização, estado global sincronizado, visualização de dados e uma experiência completa de uso.

## Stack

| Tecnologia | Uso |
|---|---|
| React 19 | Interface, composição de páginas e estado local |
| Vite 8 | Ambiente de desenvolvimento e build |
| Supabase JS 2 | Autenticação, banco PostgreSQL e RLS |
| Recharts 3 | Gráficos semanais e mensais |
| i18next + react-i18next | Traduções em PT, EN e ES |
| i18next-browser-languagedetector | Persistência do idioma no `localStorage` |
| Tailwind CSS 3 + CSS customizado | Base visual, layout responsivo, landing page e dashboard |
| USDA FoodData Central API | Fonte complementar para busca de alimentos |

## Funcionalidades

### Experiência Geral

- Landing page institucional com navegação, CTA, animações de entrada e seletor de idioma.
- Login e cadastro com email/senha via Supabase Auth.
- OAuth com Google e GitHub.
- Área autenticada com sidebar no desktop e menu deslizante no mobile.
- Tema claro/escuro: inicia em modo escuro e salva a preferência em `localStorage`.
- Interface em português, inglês e espanhol.

### Dashboard

| Página | O que faz |
|---|---|
| **Hoje** | Registra refeições, calcula macros em tempo real, controla água e mostra resumo do dia |
| **Calendário** | Exibe histórico mensal com indicadores de meta e hidratação por dia |
| **Metas** | Configura calorias, proteína, carboidratos, gordura, meta de água e medida do copo |
| **Gráficos** | Mostra evolução semanal ou mensal de macros e água com linhas de meta |
| **Favoritos** | Pesquisa alimentos, salva favoritos e adiciona itens rapidamente às refeições |

### Registro de Refeições

- Refeições padrão: café da manhã, almoço, lanche da tarde e jantar.
- Busca de alimentos com prioridade para o banco local no idioma ativo.
- Fallback para USDA quando não há resultado local.
- Alimentos podem ser adicionados em gramas ou por unidade quando houver `unit` e `gramsPerUnit`.
- Preview de calorias, proteína, carboidratos e gordura antes de adicionar.
- Remoção de itens já registrados.
- Resumo por refeição e total consolidado do dia.

### Favoritos

- Favoritar alimentos direto da tela **Hoje**.
- Aba dedicada para buscar alimentos e salvar favoritos.
- Lista de favoritos persistida por usuário no Supabase.
- Inclusão rápida em uma refeição selecionada, com gramagem editável.
- Componente de acesso rápido aos favoritos dentro da tela **Hoje**.

### Hidratação

- Meta diária de água configurável.
- Medida do copo configurável, com padrão atual de `500ml`.
- Copos clicáveis para registrar consumo.
- Entrada manual em `ml` ou `L`.
- Barra de progresso, indicação do volume restante e botão para zerar o dia.

### Gráficos e Histórico

- Gráficos de calorias, proteína, carboidratos, gordura e água.
- Alternância entre visão semanal e mensal.
- Médias por dia e porcentagem em relação à meta.
- Calendário com cores para aderência à meta de calorias.
- Indicador separado para dias com água registrada.
- Detalhe diário com macros, água e porcentagens da meta.

### Internacionalização

- Idiomas suportados: `pt`, `en`, `es`.
- Português é o fallback padrão.
- A escolha do idioma é salva no `localStorage`.
- Textos da interface e nomes do banco local de alimentos acompanham o idioma ativo.

## Dados e Persistência

O estado principal fica em `TrackerContext`, que mantém metas, logs diários, água, favoritos, alimentos recentes e alimentos mais usados. As alterações relevantes são sincronizadas com o Supabase.

| Tabela | Conteúdo |
|---|---|
| `profiles` | Metas nutricionais e preferências do usuário |
| `daily_logs` | Refeições e água registradas por data |
| `favoritos` | Lista de alimentos favoritos do usuário |

Todas as tabelas usam Row Level Security, garantindo que cada usuário acesse apenas os próprios dados.

## Banco de Alimentos

O projeto inclui uma base local com **148 alimentos** em português, inglês e espanhol. Cada item guarda calorias, proteína, carboidratos e gordura por 100g. Alguns alimentos também têm unidade prática, como fatia, unidade, dente ou porção equivalente, usando `unit` e `gramsPerUnit`.

Categorias contempladas: carnes, peixes, ovos, proteínas, laticínios, cereais, pães, massas, leguminosas, tubérculos, frutas, vegetais, oleaginosas, gorduras, bebidas e itens complementares.

## Estrutura do Projeto

```text
macro-tracker/
|-- public/
|-- src/
|   |-- assets/              # Imagens e assets estáticos
|   |-- components/          # Componentes reutilizáveis
|   |-- context/             # ThemeContext e TrackerContext
|   |-- data/                # Base local de alimentos
|   |-- i18n/                # Configuração e traduções PT/EN/ES
|   |-- pages/               # Landing, Login e páginas do dashboard
|   |-- services/            # Supabase, persistência e busca de alimentos
|   |-- styles/              # CSS da landing e da área autenticada
|   |-- App.jsx              # Controle de auth, landing e shell do dashboard
|   |-- main.jsx             # Entry point React
|-- package.json
|-- vite.config.js
```

## Como Rodar Localmente

```bash
git clone https://github.com/pedropcorsini/macro-tracker.git
cd macro-tracker
npm install
npm run dev
```

O app fica disponível em:

```text
http://localhost:5173
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_ANON
VITE_USDA_API_KEY=SUA_CHAVE_USDA
```

O `.env` está no `.gitignore` e não deve ser versionado.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Pré-visualiza o build localmente |
| `npm run lint` | Executa o ESLint |

## Configuração do Supabase

1. Crie um projeto em `https://supabase.com`.
2. Copie `Project URL` e `anon public key` para o `.env`.
3. Execute o schema abaixo no SQL Editor.
4. Ative Google e GitHub em Authentication > Providers se quiser usar OAuth.

<details>
<summary>Schema SQL</summary>

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  goals jsonb default '{"cal":2000,"p":150,"c":200,"f":65,"water":2500,"cupMl":500,"waterUnit":"ml"}'::jsonb,
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

</details>

## API USDA

A busca de alimentos usa primeiro a base local. Quando não encontra resultados, o serviço tenta consultar a USDA FoodData Central API.

Para obter uma chave:

1. Acesse `https://fdc.nal.usda.gov/api-key-signup.html`.
2. Solicite a chave gratuita.
3. Adicione a chave em `VITE_USDA_API_KEY`.

## Personalização

- **Metas padrão:** edite `initialState.goals` em `src/context/TrackerContext.jsx`.
- **Novos alimentos:** adicione itens em `src/data/foods.js` mantendo o mesmo `id` nas três línguas.
- **Novo idioma:** crie o arquivo de tradução em `src/i18n`, registre em `src/i18n/index.js`, adicione no `LanguageSelect` e inclua a base em `foodsData`.
- **Estilos:** ajuste `src/styles/app.css` para a área autenticada e `src/styles/landing.css` para a landing page.

## Deploy

O projeto está preparado para deploy em plataformas como Vercel:

```bash
npm run build
```

Configuração recomendada:

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Adicione as variáveis de ambiente do `.env` no painel da plataforma antes de publicar.

## Segurança

- A `anon key` do Supabase pode ser usada no frontend quando as tabelas estão protegidas por RLS.
- As policies limitam leitura e escrita ao usuário autenticado.
- O arquivo `.env` não deve ser commitado.
- OAuth é delegado ao Supabase Auth.

## Licença

Projeto desenvolvido por Pedro Passos Corsinis para fins de estudo e portfólio profissional.
