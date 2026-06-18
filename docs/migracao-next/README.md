# Migração para Next.js

Documentação de referência para migrar o Pixel Therapy de `frontend/` (Vite + Express) + `backend/` (Express) para um único projeto Next.js, hospedável na Vercel sem servidor separado.

---

## 1. Por que migrar

Hoje são **dois serviços**:

```
pixel-therapy/
  frontend/   → Vite + React + TS (SPA, :5173)
  backend/    → Node + Express + TS (API, :3001)
```

Em produção isso exigiria hospedar a API em algum lugar (Render, Railway, EC2, etc.) separado do frontend estático. Como o backend é minúsculo — um único endpoint que chama a OpenAI —, não compensa manter essa separação. Next.js permite servir frontend e API do mesmo projeto, deployável inteiro na Vercel.

---

## 2. Como o Next.js funciona (conceitos principais)

### 2.1 App Router — a pasta é a rota

Em vez de configurar rotas manualmente (como com `react-router`), a estrutura de arquivos dentro de `app/` define as rotas automaticamente:

```
app/
  page.tsx              → rota "/"
  layout.tsx            → layout compartilhado (envolve as páginas)
  api/
    generate-pixel-art/
      route.ts           → endpoint "/api/generate-pixel-art"
```

### 2.2 Server Components vs Client Components

Essa é a maior mudança conceitual. Por padrão, **todo componente dentro de `app/` roda no servidor** (Server Component): ele gera HTML antes de chegar no navegador, e o código dele nunca é enviado como JS para o cliente. Isso é ótimo para conteúdo estático, mas um Server Component **não pode usar `useState`, `useEffect`, `onClick`** — nada que dependa de interatividade no navegador.

Para componentes interativos, adiciona-se a diretiva `"use client"` no topo do arquivo. Isso transforma o componente em um Client Component normal — exatamente como o que já existe hoje no Vite.

```tsx
// app/page.tsx — Server Component (roda no servidor)
import { GamePage } from "./GamePage";

export default function Home() {
  return <GamePage />;
}
```

```tsx
// app/GamePage.tsx
"use client";

export function GamePage() {
  const [game, setGame] = useState(/* ... */);
  // resto igual ao que já existe hoje
}
```

**No Pixel Therapy, quase tudo continua sendo Client Component** — o jogo é todo interativo (cliques, estado, pintura, áudio). O ganho de "Server Components" aqui é pequeno; o ganho real é outro: unificar front + back num projeto só.

### 2.3 Route Handlers — o substituto do Express

Cada arquivo `route.ts` dentro de `app/api/.../` exporta funções nomeadas pelo método HTTP (`GET`, `POST`, etc.):

```ts
// app/api/generate-pixel-art/route.ts
import { NextResponse } from "next/server";
import { generatePixelArtChallenge } from "@/lib/openaiService";

export async function POST() {
  try {
    const challenge = await generatePixelArtChallenge();
    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Erro ao gerar pixel art:", error);
    return NextResponse.json(
      { error: "Não foi possível gerar um novo padrão. Tente novamente." },
      { status: 502 },
    );
  }
}
```

Isso roda **no mesmo processo/projeto** que o frontend, mesma origem — sem Express, sem CORS, sem proxy de dev. `/api/generate-pixel-art` já existe automaticamente.

### 2.4 Variáveis de ambiente

- `OPENAI_API_KEY` continua **só acessível no servidor**: qualquer variável em `.env.local` só fica disponível em código que roda no servidor (Route Handlers, Server Components) por padrão.
- Só levaria o prefixo `NEXT_PUBLIC_` se precisássemos expor algo ao navegador (não é o caso aqui).
- Em produção (Vercel), a env var é configurada direto no painel do projeto.

### 2.5 Comparação lado a lado

| Aspecto | Atual (Vite + Express) | Next.js |
|---|---|---|
| Processos em dev | 2 (`vite` + `tsx watch`) | 1 (`next dev`) |
| Roteamento frontend | manual (hoje só 1 página) | baseado em pastas (`app/`) |
| API | Express, porta própria | Route Handlers, mesma origem |
| CORS / proxy | precisa configurar | não precisa |
| Deploy | 2 serviços | 1 serviço (Vercel) |
| Variáveis de ambiente | `.env` no backend | `.env.local`, server-only por padrão |
| Componentes | todos "client" (SPA) | "server" por padrão, "client" sob demanda |

---

## 3. Decisões já tomadas

### 3.1 Estilo: CSS Modules no lugar de styled-components

O App Router renderiza primeiro no servidor (HTML gerado antes de chegar no navegador). O styled-components injeta `<style>` tags *durante* a renderização — sem um mecanismo extra (um "registry" com `useServerInsertedHTML`), o HTML inicial chega sem CSS, causando flash de conteúdo sem estilo. Esse registry é uma receita documentada e funcional, mas é mais uma peça de configuração e mantém o custo de runtime do CSS-in-JS.

CSS Modules tem suporte nativo no Next, sem configuração nenhuma, com CSS extraído em build (zero runtime JS para estilo). Optamos por migrar os 8 arquivos que usam `styled-components` para `.module.css`.

**Como resolver os casos hoje dinâmicos (props do styled-components):**

- **Valores variáveis em runtime** (ex: `$color={palette[value]}`, cor vinda da IA) → variável CSS (custom property) setada via `style` inline e consumida no `.module.css` com `var(--cell-color)`. Só o valor dinâmico vai inline; o resto da regra continua em CSS normal.

  ```css
  /* PixelGrid.module.css */
  .cell {
    background-color: var(--cell-color);
  }
  ```
  ```tsx
  <button className={styles.cell} style={{ "--cell-color": palette[value] }} />
  ```

- **Estados booleanos finitos** (`$editable`, `$wrong`, `$selected`, `$vertical`) → classes condicionais combinadas com `clsx`:

  ```tsx
  <button className={clsx(styles.cell, editable && styles.editable, wrong && styles.wrong)} />
  ```

- **`@keyframes`** (usado em `LoadingBlocks`) → migra 1:1, `.module.css` suporta `@keyframes` normalmente.

Arquivos afetados: `ColorPalette.tsx`, `LoadingBlocks.tsx`, `LoadingOverlay.tsx`, `PixelGrid.tsx`, `ResultPanel.tsx`, `SoundToggle.tsx`, `GamePage.tsx`, `styles/GlobalStyle.ts` (vira `app/globals.css`).

### 3.2 Tailwind foi considerado e descartado para o problema de cor dinâmica

Tailwind gera CSS escaneando o código-fonte em **build time** — uma classe como `bg-[${corEmRuntime}]` não é detectada porque o valor só existe depois de rodar o JS. Ou seja, o problema da cor dinâmica da paleta seria resolvido da mesma forma (variável CSS / inline style) independente de usar Tailwind ou CSS Modules. Isso não foi motivo suficiente para trocar a escolha por CSS Modules.

### 3.3 Áudio (`vintage-jazz.m4a`)

Hoje é importado como módulo: `import ambientTrack from "../assets/vintage-jazz.m4a"`. No Next, o caminho recomendado é mover o arquivo para `public/` e referenciar por path string (`/vintage-jazz.m4a`), evitando configuração extra de bundler para tipos de arquivo de áudio.

---

## 4. Mapeamento de arquivos

| Hoje | Em Next |
|---|---|
| `frontend/src/pages/GamePage.tsx` | `app/GamePage.tsx` (com `"use client"`, estilos em `.module.css`) |
| `frontend/src/components/*` | `components/*` (mantêm `"use client"`, estilos em `.module.css`) |
| `frontend/src/utils/*` | `lib/*` (sem alteração de lógica) |
| `frontend/src/types/*` | `types/*` (compartilhado entre client e server, sem duplicar) |
| `frontend/src/styles/GlobalStyle.ts` | `app/globals.css` |
| `frontend/src/assets/vintage-jazz.m4a` | `public/vintage-jazz.m4a` |
| `backend/src/routes/generatePixelArt.ts` | `app/api/generate-pixel-art/route.ts` |
| `backend/src/services/openaiService.ts` | `lib/openaiService.ts` (chamado direto pelo Route Handler, sem HTTP) |
| `backend/src/data/palettes.ts` | `lib/palettes.ts` |
| `backend/.env` (`OPENAI_API_KEY`) | `.env.local` na raiz do projeto Next + env var na Vercel em produção |
| `vite.config.ts` (proxy `/api`) | **removido** — não é mais necessário |

Ganho colateral: hoje `frontend/src/types/pixelArt.ts` e `backend/src/types/pixelArt.ts` são duplicados manualmente. No projeto único, esse tipo existe uma vez só, importado tanto pelo Route Handler quanto pelos componentes.

---

## 5. Pontos de atenção

- Curva de aprendizado: Server vs Client Components, App Router, Route Handlers são conceitos novos.
- Reescrita dos 8 arquivos de estilo (`styled-components` → `.module.css` + `clsx`). Esforço contido — são ~815 linhas no total.
- Adicionar `clsx` como dependência nova (pequena, sem runtime relevante).

---

## 6. Decisão pendente

- **Onde o projeto Next vai viver**: substituir `frontend/` + `backend/` por uma estrutura na raiz do repo, ou criar um diretório novo (ex: `web/`) e aposentar os antigos depois de validado?

---

## 7. Checklist de execução

- [ ] Decidir local do projeto Next (ver seção 6)
- [ ] Rodar `npx create-next-app@latest` (TypeScript, App Router)
- [ ] Configurar `next.config.js` se necessário (não precisa de plugin para CSS Modules, é nativo)
- [ ] Mover `types/pixelArt.ts` e `types/game.ts` para `types/` na raiz do novo projeto
- [ ] Mover `lib/palettes.ts` e `lib/openaiService.ts` (ajustando imports `.js` → sem extensão)
- [ ] Criar `app/api/generate-pixel-art/route.ts` a partir de `backend/src/routes/generatePixelArt.ts`
- [ ] Migrar `GlobalStyle.ts` → `app/globals.css`
- [ ] Migrar cada componente: `styled-components` → `ComponentName.module.css` + `clsx` para variantes + variável CSS para cores dinâmicas
- [ ] Mover `vintage-jazz.m4a` para `public/` e ajustar referência no `SoundToggle`
- [ ] Mover `GamePage` e componentes para `app/`/`components/`, com `"use client"`
- [ ] Criar `.env.local` com `OPENAI_API_KEY`
- [ ] Rodar `npm run dev` e testar o fluxo completo (gerar desafio, pintar, verificar, som)
- [ ] Configurar `OPENAI_API_KEY` nas env vars do projeto na Vercel
- [ ] Deploy na Vercel e validar em produção



