# Pixel Therapy — Estrutura atual vs Next.js

Documento didático para entender as diferenças entre a arquitetura atual (Vite + Express separados) e como o projeto ficaria em Next.js. Serve de referência para um experimento numa branch `next`.

---

## 1. Estrutura atual (recap)

```
pixel-therapy/
  frontend/   → Vite + React + TS (SPA, roda em :5173/5174)
  backend/    → Node + Express + TS (API, roda em :3001)
```

- O frontend é uma SPA: o navegador carrega um `index.html` + bundle JS, e tudo renderiza no cliente.
- O backend é um servidor Express separado, com sua própria porta, que expõe `/api/generate-pixel-art`.
- Em dev, o Vite faz proxy de `/api` → `http://localhost:3001` (configurado em `vite.config.ts`) para evitar CORS.
- Em produção, seriam **dois serviços** para hospedar (ex: um para o frontend estático, outro para a API Node).

Essa separação é o modelo "clássico": front e back são projetos independentes, cada um com seu próprio `package.json`, build e deploy.

---

## 2. O que é o Next.js

Next.js é um framework React que roda **no servidor e no cliente ao mesmo tempo**, dentro de um único projeto. As duas peças principais:

### 2.1 App Router (roteamento por pastas)

Em vez de você montar rotas manualmente (como faria com `react-router`), a estrutura de pastas *é* a rota:

```
app/
  page.tsx              → rota "/"
  layout.tsx            → layout compartilhado (envolve as páginas)
  api/
    generate-pixel-art/
      route.ts           → endpoint "/api/generate-pixel-art"
```

### 2.2 Server Components vs Client Components

Por padrão, todo componente em `app/` é um **Server Component**: ele roda no servidor, nunca é enviado como JS para o navegador. Isso é ótimo para conteúdo estático/dados, mas **não pode usar `useState`, `useEffect`, `onClick`, etc.**

Para componentes interativos (como o nosso `GamePage`, `PixelGrid`, `ColorPalette`), você adiciona a diretiva `"use client"` no topo do arquivo — aí o componente vira um Client Component normal, igual ao que já temos hoje.

```tsx
// app/page.tsx (Server Component, roda no servidor)
import { GamePage } from "./GamePage";

export default function Home() {
  return <GamePage />;
}
```

```tsx
// app/GamePage.tsx
"use client";

export function GamePage() {
  const [game, setGame] = useState(...);
  // ... igual ao que já existe hoje
}
```

Na prática, para o Pixel Therapy, **quase tudo continuaria sendo Client Component** — o jogo é todo interativo (cliques, estado, pintura). O Next aqui não traria muito ganho de "Server Components" propriamente, mas ainda traria o ganho do item seguinte.

### 2.3 Route Handlers (API routes)

É o substituto do Express. Cada `route.ts` dentro de `app/api/.../` exporta funções nomeadas pelo método HTTP:

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

Isso roda **no mesmo processo/projeto** que o frontend. Não precisa de Express, CORS, nem proxy — `/api/generate-pixel-art` já existe automaticamente, mesma origem.

---

## 3. Comparação lado a lado

| Aspecto | Atual (Vite + Express) | Next.js |
|---|---|---|
| Processos em dev | 2 (`vite` + `tsx watch`) | 1 (`next dev`) |
| Roteamento frontend | manual (hoje só 1 página) | baseado em pastas (`app/`) |
| API | Express, porta própria | Route Handlers, mesma origem |
| CORS / proxy | precisa configurar | não precisa |
| Deploy | 2 serviços | 1 serviço (ex: Vercel) |
| Variáveis de ambiente | `.env` no backend | `.env.local`, server-only por padrão |
| Componentes | todos "client" (SPA) | "server" por padrão, "client" sob demanda |

---

## 4. Como o Pixel Therapy ficaria em Next

### 4.1 Mapeamento de arquivos

| Hoje | Em Next |
|---|---|
| `frontend/src/pages/GamePage.tsx` | `app/GamePage.tsx` (com `"use client"`) |
| `frontend/src/components/*` | `components/*` (mantêm `"use client"` por usarem hooks/eventos) |
| `frontend/src/utils/*` | `lib/*` (sem alteração de lógica) |
| `frontend/src/types/*` | `types/*` (compartilhado entre client e server, sem duplicar) |
| `frontend/src/styles/GlobalStyle.ts` | precisa de ajuste (ver 4.3) |
| `backend/src/routes/generatePixelArt.ts` | `app/api/generate-pixel-art/route.ts` |
| `backend/src/services/openaiService.ts` | `lib/openaiService.ts` (chamado direto pelo Route Handler, sem HTTP) |
| `backend/src/data/palettes.ts` | `lib/palettes.ts` |
| `backend/.env` (`OPENAI_API_KEY`) | `.env.local` na raiz do projeto Next |
| `vite.config.ts` (proxy `/api`) | **removido** — não é mais necessário |

Um ganho interessante: hoje `frontend/src/types/pixelArt.ts` e `backend/src/types/pixelArt.ts` são **duplicados manualmente**. Em Next, como é um projeto só, esse tipo existe **uma única vez** e é importado tanto pelo Route Handler quanto pelos componentes.

### 4.2 Variáveis de ambiente

- `OPENAI_API_KEY` continua **só no servidor** — em Next, qualquer variável em `.env.local` só fica disponível em código que roda no servidor (Route Handlers, Server Components) por padrão.
- Só precisaria do prefixo `NEXT_PUBLIC_` se quiséssemos expor algo ao navegador (não é o caso aqui).

### 4.3 styled-components em Next

O App Router usa Server Components, e bibliotecas CSS-in-JS como `styled-components` precisam de uma configuração extra (um "registry" para extrair os estilos no SSR) para não dar flash de conteúdo sem estilo. É um setup conhecido e documentado, mas é um detalhe a mais comparado ao Vite (onde simplesmente funciona).

Alternativa: aproveitar a migração para experimentar CSS Modules ou Tailwind, que têm suporte nativo no Next sem configuração extra — mas isso seria uma decisão à parte, não uma exigência.

---

## 5. Vantagens de migrar

- Um único projeto, um único `npm run dev`, um único deploy.
- Sem proxy/CORS — API e frontend são "a mesma coisa".
- Tipos compartilhados sem duplicação.
- Bom motivo para aprender Next na prática com um projeto pequeno e já validado.

## 6. Pontos de atenção

- Curva de aprendizado: Server vs Client Components, App Router, Route Handlers são conceitos novos.
- Setup extra para `styled-components` (ou trocar de abordagem de estilo).
- O ganho de "Server Components" é pequeno aqui, já que o jogo é majoritariamente interativo — o principal benefício real é a unificação front+back.

---

## 7. Checklist para a branch `next` (experimento)

- [ ] Criar branch `next`
- [ ] Rodar `npx create-next-app@latest` (TypeScript, App Router) num diretório novo (ex: `pixel-therapy-next/`)
- [ ] Configurar `styled-components` com o registry do App Router (ou decidir trocar a abordagem de CSS)
- [ ] Mover `types/pixelArt.ts` e `types/game.ts` para `types/` na raiz do novo projeto
- [ ] Mover `lib/palettes.ts` e `lib/openaiService.ts` (adaptando imports `.js` → sem extensão, conforme convenção Next)
- [ ] Criar `app/api/generate-pixel-art/route.ts` a partir de `backend/src/routes/generatePixelArt.ts`
- [ ] Mover `GamePage` e componentes para `app/`/`components/`, com `"use client"`
- [ ] Criar `.env.local` com `OPENAI_API_KEY`
- [ ] Rodar `npm run dev` e testar o fluxo completo (gerar desafio, pintar, verificar)
- [ ] Comparar a experiência de desenvolvimento com a estrutura atual e decidir se vale migrar de vez
