# 🥗 Macro Tracker — Web App

App web completo para acompanhamento de nutrição diária com registro de refeições, controle de macronutrientes, hidratação, histórico por calendário, gráficos de evolução e suporte a múltiplos idiomas.
**Versão atual - landing page institucional, autenticação via Supabase, modo claro/escuro, internacionalização (PT / EN / ES) e interface visual clean com seletor customizado de idioma.**

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI e gerenciamento de estado |
| Vite | 8 | Bundler e dev server |
| Tailwind CSS | 3 | Base de estilos e utilitários |
| CSS customizado | — | Layout, landing page, superfícies e componentes visuais |
| Supabase JS | 2 | Banco PostgreSQL + autenticação + RLS |
| Recharts | 3 | Gráficos semanais e mensais |
| i18next + react-i18next | 26 / 17 | Internacionalização (PT / EN / ES) |
| Language Detector | 8 | Persistência do idioma salvo no `localStorage` |
| USDA FoodData Central API | — | Base complementar com 300k+ alimentos |

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

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...SUA_CHAVE_AQUI
VITE_USDA_API_KEY=SUA_CHAVE_USDA_AQUI
```

> ⚠️ O arquivo `.env` já está no `.gitignore` — nunca suba suas chaves para o GitHub.

---

## Configurar o Supabase

### 1. Criar uma conta gratuita

Acesse **https://supabase.com** e crie um projeto.

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

Em **Authentication → Providers**, ative Google e/ou GitHub seguindo as instruções do Supabase.

---

## Configurar a API de Alimentos (USDA)

1. Acesse **https://fdc.nal.usda.gov/api-key-signup.html**
2. Preencha o formulário
3. Aguarde o e-mail com sua chave e cole no `.env`

> A busca prioriza o banco local no idioma selecionado. A API USDA é usada como complemento quando nenhum resultado local é encontrado.

---

## Estrutura de pastas

```text
macro-tracker/
├── public/
├── .env                              ← Suas credenciais (não commitar)
├── index.html
└── src/
    ├── assets/
    ├── components/
    │   ├── AlimentosRapidos.jsx      ← Acesso rápido a favoritos na tela Hoje
    │   └── LanguageSelect.jsx        ← Dropdown customizado de idiomas
    ├── context/
    │   ├── ThemeContext.jsx          ← Controle de tema claro/escuro
    │   └── TrackerContext.jsx        ← Estado global + sync com Supabase
    ├── data/
    │   └── foods.js                  ← Banco local com 148 alimentos em PT, EN e ES
    ├── i18n/
    │   ├── index.js                  ← Configuração do i18next (PT padrão)
    │   ├── pt.js                     ← Traduções em português
    │   ├── en.js                     ← Traduções em inglês
    │   └── es.js                     ← Traduções em espanhol
    ├── pages/
    │   ├── Landing.jsx               ← Landing page institucional
    │   ├── Login.jsx                 ← Autenticação com email/senha e OAuth
    │   ├── Hoje.jsx                  ← Registro de refeições e hidratação
    │   ├── Calendario.jsx            ← Histórico por calendário
    │   ├── Metas.jsx                 ← Configuração de metas diárias
    │   ├── Graficos.jsx              ← Gráficos semanais e mensais
    │   └── Favoritos.jsx             ← Gestão e adição rápida de favoritos
    ├── services/
    │   ├── db.js                     ← Leitura e escrita no Supabase
    │   ├── supabase.js               ← Cliente Supabase
    │   └── usda.js                   ← Busca local + fallback para USDA
    ├── styles/
    │   ├── app.css                   ← Estilos da área autenticada e login
    │   └── landing.css               ← Estilos da landing page
    ├── App.jsx                       ← Shell principal, landing, auth e dashboard
    ├── index.css                     ← Base Tailwind + tema global
    └── main.jsx                      ← Entry point
```

---

## Funcionalidades

### Páginas disponíveis

| Página | Descrição |
|---|---|
| **Landing** | Apresentação do produto com seções institucionais, CTA e seletor de idioma |
| **Login** | Login e cadastro com email/senha, Google, GitHub, alternância de tema e idioma |
| **Hoje** | Registra refeições por período do dia, controla hidratação e exibe macros em tempo real |
| **Calendário** | Visualiza o histórico com indicadores coloridos por dia |
| **Metas** | Define objetivos diários de calorias, proteína, carboidratos, gordura e água |
| **Gráficos** | Barras semanais e mensais com linha de meta para cada macro |
| **Favoritos** | Lista alimentos salvos e permite adição rápida com gramagem personalizada |

### Experiência e interface

- Landing page com visual clean, navegação fixa e seções de apresentação do app
- Tela de autenticação com layout próprio, suporte a Google e GitHub e controle de tema
- Área logada com sidebar, topbar mobile e conteúdo principal com scroll independente
- Seletor customizado de idioma com a mesma estética do restante da interface
- Primeiro acesso em **português** por padrão; preferência de idioma e tema é salva no `localStorage`

### Registro de refeições

| Refeição | Idioma PT | Idioma EN | Idioma ES |
|---|---|---|---|
| Café da manhã | Café da manhã | Breakfast | Desayuno |
| Almoço | Almoço | Lunch | Almuerzo |
| Lanche da tarde | Lanche da tarde | Afternoon snack | Merienda |
| Jantar | Jantar | Dinner | Cena |

- Busca em banco local no idioma selecionado com fallback automático para API USDA
- Entrada por **gramas** ou **unidade** (ovos, fatias, frutas, etc.)
- Preview de macros em tempo real antes de adicionar
- Resumo por refeição e total consolidado do dia
- Botão de favorito para salvar alimentos usados com frequência

### Favoritos e acesso rápido

- Tela dedicada para gerenciar favoritos
- Bloco de adição rápida na tela **Hoje**
- Inclusão instantânea com quantidade em gramas
- Persistência de favoritos por usuário no Supabase

### Controle de hidratação

- Copos clicáveis baseados na meta e tamanho do copo configurado
- Input manual em **ml** ou **L**
- Barra de progresso e indicador de quanto falta para a meta
- Botão para zerar o registro do dia

### Banco local de alimentos

**148 alimentos** organizados por categoria, com nomes traduzidos em PT, EN e ES:

| Categoria | Exemplos |
|---|---|
| Carnes e aves | Peito de frango, bife de alcatra, picanha, bacon, presunto |
| Peixes e frutos do mar | Salmão, atum, tilápia, camarão, bacalhau |
| Ovos e proteínas | Ovo inteiro, clara, whey protein, tofu, tempeh |
| Laticínios | Iogurte grego, cottage, mussarela, cheddar, parmesão |
| Cereais e grãos | Arroz branco/integral, aveia, quinoa, granola, tapioca |
| Pães e massas | Pão francês, pão integral, pita, macarrão, macarrão integral |
| Leguminosas | Feijão carioca/preto/branco, lentilha, grão-de-bico, ervilha |
| Tubérculos | Batata-doce, batata inglesa, mandioca, inhame |
| Frutas | Banana, maçã, mamão, manga, abacate, morango, kiwi, mirtilo |
| Vegetais | Brócolis, espinafre, cenoura, beterraba, couve-flor, aspargo |
| Oleaginosas e gorduras | Azeite, amendoim, amêndoas, castanha, chia, linhaça |
| Bebidas | Suco de laranja, leite de aveia, leite de amêndoas, café, chá |
| Outros | Mel, açúcar, chocolate amargo, maionese, molho de soja |

---

## Idiomas suportados

| Idioma | Código | Comportamento atual |
|---|---|---|
| Português (BR) | PT | Padrão inicial do app |
| English | EN | Seleção manual com persistência |
| Español | ES | Seleção manual com persistência |

O app inicia em **português** quando não existe preferência salva. Depois disso, a escolha do usuário é persistida no `localStorage` e restaurada automaticamente nas próximas visitas. O idioma pode ser alterado pelo seletor presente na **landing page**, na **tela de login** e na **sidebar** da área logada. Os nomes dos alimentos do banco local também mudam conforme o idioma selecionado.

---

## Banco de dados (Supabase)

### Tabelas

| Tabela | Descrição |
|---|---|
| `profiles` | Metas e preferências do usuário |
| `daily_logs` | Refeições e consumo de água por dia |
| `favoritos` | Lista de alimentos favoritos por usuário |

### Segurança (RLS)

Todas as tabelas têm **Row Level Security** ativado — cada usuário acessa somente seus próprios dados.

---

## Responsividade

| Dispositivo | Layout |
|---|---|
| Desktop (≥ 1024px) | Sidebar fixa 224px + conteúdo principal com scroll independente |
| Tablet / Mobile (< 1024px) | Topbar com botão hamburger que abre sidebar deslizante + overlay escuro |

---

## Tema claro / escuro

O tema segue o sistema operacional no primeiro acesso. O usuário pode alternar manualmente pelo botão da interface, e a preferência é salva no `localStorage`.

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

Em `src/data/foods.js`, adicione o alimento nas três línguas com o mesmo `id`:

```js
// Em foodsData.pt
{ id: 149, name: "Creme de avelã", cal: 539, p: 6, c: 58, f: 31 },

// Em foodsData.en
{ id: 149, name: "Hazelnut spread", cal: 539, p: 6, c: 58, f: 31 },

// Em foodsData.es
{ id: 149, name: "Crema de avellanas", cal: 539, p: 6, c: 58, f: 31 },
```

### Alterar metas padrão

Em `src/context/TrackerContext.jsx`, edite `initialState.goals`:

```js
goals: { cal: 2000, p: 150, c: 200, f: 65, water: 2500, cupMl: 250, waterUnit: "ml" }
```

### Alterar idioma padrão

Em `src/i18n/index.js`, ajuste a inicialização de `lng` e `fallbackLng` se quiser trocar o padrão atual de `pt`.

### Adicionar um novo idioma

1. Crie `src/i18n/fr.js` com todas as chaves traduzidas
2. Importe e registre o idioma em `src/i18n/index.js`
3. Adicione o idioma ao array `LANGUAGES` em `src/components/LanguageSelect.jsx`
4. Adicione `foodsData.fr` em `src/data/foods.js`

---

## Segurança

- Nunca commite o arquivo `.env` no Git
- A `anon key` do Supabase é segura para uso no frontend quando usada com RLS
- A chave da API USDA é gratuita e usada apenas como complemento da base local
- Login com Google e GitHub usa OAuth via Supabase

---

## Licença

Projeto desenvolvido para fins de portfólio. Todos os direitos reservados.
