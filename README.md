# 🥗 Macro Tracker — Web App

App web completo para acompanhamento de nutrição diária com registro de refeições, controle de macronutrientes, hidratação, histórico por calendário, gráficos de evolução e suporte a múltiplos idiomas.
**Versão 2.0 — autenticação real, banco de dados na nuvem via Supabase, modo escuro/claro e internacionalização (PT / EN / ES).**

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | UI e gerenciamento de estado |
| Vite | 5 | Bundler e dev server |
| Tailwind CSS | 3 | Estilização com suporte a dark mode |
| Supabase | — | Banco PostgreSQL + autenticação + RLS |
| Recharts | — | Gráficos de barras semanais e mensais |
| i18next | — | Internacionalização (PT / EN / ES) |
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

Crie um arquivo `.env` na raiz do projeto:

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

Em **Authentication → Providers**, ative Google e/ou GitHub seguindo as instruções do Supabase.

---

## Configurar a API de Alimentos (USDA)

1. Acesse **https://fdc.nal.usda.gov/api-key-signup.html**
2. Preencha o formulário
3. Aguarde o e-mail com sua chave e cole no `.env`

> A busca prioriza o banco local no idioma selecionado. A API USDA é usada como complemento quando nenhum resultado local é encontrado.

---

## Estrutura de pastas

```
macro-tracker/
├── public/
├── .env                              ← Suas credenciais (NÃO commitar!)
├── index.html
└── src/
    ├── components/
    │   └── AlimentosRapidos.jsx      ← Acesso rápido a alimentos favoritos
    ├── context/
    │   ├── TrackerContext.jsx        ← Estado global + sync com Supabase
    │   └── ThemeContext.jsx          ← Controle de tema claro/escuro
    ├── data/
    │   └── foods.js                  ← Banco local com 148 alimentos em PT, EN e ES
    ├── i18n/
    │   ├── index.js                  ← Configuração do i18next
    │   ├── pt.js                     ← Traduções em português
    │   ├── en.js                     ← Traduções em inglês
    │   └── es.js                     ← Traduções em espanhol
    ├── pages/
    │   ├── Hoje.jsx                  ← Registro de refeições e hidratação
    │   ├── Calendario.jsx            ← Histórico por calendário
    │   ├── Metas.jsx                 ← Configuração de metas diárias
    │   ├── Graficos.jsx              ← Gráficos semanais e mensais
    │   ├── Favoritos.jsx             ← Alimentos favoritos
    │   └── Login.jsx                 ← Autenticação
    ├── services/
    │   ├── supabase.js               ← Cliente Supabase
    │   ├── db.js                     ← Funções de leitura/escrita no banco
    │   └── usda.js                   ← Integração com API USDA + banco local
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
| **Favoritos** | Acesso rápido a alimentos marcados com ♥ |

### Registro de refeições

| Refeição | Idioma PT | Idioma EN | Idioma ES |
|---|---|---|---|
| Café da manhã | Café da manhã | Breakfast | Desayuno |
| Almoço | Almoço | Lunch | Almuerzo |
| Lanche da tarde | Lanche da tarde | Afternoon snack | Merienda |
| Jantar | Jantar | Dinner | Cena |

- Busca em banco local (idioma selecionado) com fallback automático para API USDA
- Entrada por **gramas** ou **unidade** (ovos, fatias, frutas, etc.)
- Preview de macros em tempo real antes de adicionar
- Painel lateral com resumo por refeição e total do dia

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

| Idioma | Código | Detecção automática |
|---|---|---|
| Português (BR) | PT | Sim |
| English | EN | Sim |
| Español | ES | Sim |

O idioma é detectado automaticamente pelo navegador no primeiro acesso. O usuário pode trocar manualmente pelos botões **PT / EN / ES** na sidebar. A preferência é salva no `localStorage`. Os nomes dos alimentos no banco local também mudam conforme o idioma selecionado.

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
| Tablet / Mobile (< 1024px) | Topbar com botão hamburger ☰ que abre sidebar deslizante + overlay escuro |

---

## Tema claro / escuro

O tema segue automaticamente o sistema operacional no primeiro acesso. O usuário pode alternar manualmente pelo botão na sidebar. A preferência é salva no `localStorage`.

---

## Deploy no Vercel

```bash
# 1. Subir o código para o GitHub
git add .
git commit -m "feat: macro tracker v2"
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
goals: { cal: 2500, p: 180, c: 250, f: 70, water: 3000, cupMl: 300, waterUnit: "ml" }
```

### Adicionar um novo idioma

1. Cria `src/i18n/fr.js` com todas as chaves traduzidas
2. Importa e registra em `src/i18n/index.js`
3. Adiciona o botão `FR` na sidebar do `App.jsx`
4. Adiciona o array de nomes em `foodsData.fr` no `foods.js`

---

## Segurança

- Nunca commite o arquivo `.env` no git
- A `anon key` do Supabase é segura para uso no frontend (RLS protege os dados)
- A chave da API USDA é gratuita com limite de 1.000 requisições/hora
- Login com Google e GitHub usa OAuth via Supabase

---

## Licença

Projeto desenvolvido para fins de portfólio. Todos os direitos reservados.
