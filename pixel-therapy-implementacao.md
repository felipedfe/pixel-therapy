# Pixel Therapy — Plano de Implementação (MVP)

Baseado em `pixel-therapy-ideia.md`. Marque os checkboxes conforme for concluindo cada etapa.

---

## Etapa 0 — Setup do projeto

- [x] Criar estrutura de pastas `frontend/` e `backend/`
- [x] Inicializar repositório git (`git init`, `.gitignore`)
- [x] Inicializar `backend/` (Node + TypeScript + Express)
- [x] Inicializar `frontend/` (Vite + React + TypeScript)
- [x] Configurar ESLint/Prettier (opcional, mas ajuda a manter consistência)
- [x] Criar `.env.example` no backend com `OPENAI_API_KEY=`
- [x] Garantir que `.env` está no `.gitignore`

---

## Etapa 1 — Tipos compartilhados

- [x] Criar `frontend/src/types/pixelArt.ts` com `PixelValue`, `PixelGrid`, `PixelPalette`, `PixelArtChallenge`
- [x] Criar tipos equivalentes no backend (ou pacote/`shared` compartilhado, se preferir)
- [x] Criar `GameState` no frontend

---

## Etapa 2 — Backend: integração com OpenAI

- [x] Instalar SDK oficial (`openai`)
- [x] Criar `backend/src/data/palettes.ts` com a lista de paletas pré-definidas e `pickRandomPalette()`
- [x] Criar `backend/src/services/openaiService.ts`
  - [x] Montar prompt (conforme seção "Prompt para a IA" do doc) — IA gera apenas `title` + `grid`, sem paleta
  - [x] Usar **Structured Outputs / JSON Schema** (ver seção de análise abaixo) para forçar formato `title/grid`
  - [x] Chamar a API com o modelo escolhido (sugestão: `gpt-4o-mini`)
  - [x] Combinar o `grid` retornado pela IA com `pickRandomPalette()` para montar o `PixelArtChallenge` final
- [x] Criar função de validação do JSON retornado pela IA
  - [x] `title` existe e é string
  - [x] `grid` tem 12 linhas x 12 colunas
  - [x] todos os valores entre 0-4
- [x] Implementar retry (1-2 tentativas) caso a validação falhe
- [x] Caso falhe todas as tentativas, retornar erro controlado (ex: 502 com mensagem amigável)

---

## Etapa 3 — Backend: endpoint da API

- [ ] Criar `backend/src/routes/generatePixelArt.ts`
- [ ] Implementar `POST /api/generate-pixel-art`
- [ ] Configurar `server.ts` (Express, CORS para o frontend, porta, middlewares)
- [ ] Testar endpoint via curl/Postman e validar resposta

---

## Etapa 4 — Frontend: utilitários e lógica de jogo

- [ ] `utils/compareGrids.ts` → `calculateAccuracy(targetGrid, userGrid)`
- [ ] `createEmptyGrid(size = 12)`
- [ ] `paintCell(row, col)` (atualização imutável do grid)
- [ ] `isCellWrong(row, col)` para destacar erros
- [ ] Mapear faixas de precisão para mensagens ("Perfeito!", "Quase perfeito!", etc.)

---

## Etapa 5 — Frontend: componentes

- [ ] `PixelGrid.tsx` (reutilizável: referência e editável, props conforme doc)
- [ ] `ColorPalette.tsx` (seleção de cor, indicador de cor ativa, borracha = cor 0)
- [ ] `ResultPanel.tsx` (mostra % de acerto e mensagem)
- [ ] `GamePage.tsx` (orquestra estado do jogo, chama o backend, layout principal)

---

## Etapa 6 — Frontend: estado e fluxo do jogo

- [ ] Estado global (`useState` simples ou Zustand) para `GameState`
- [ ] Botão "Gerar novo padrão" → chama `POST /api/generate-pixel-art`
- [ ] Loading state enquanto a IA gera o desafio
- [ ] Tratamento de erro (ex: backend indisponível, IA falhou)
- [ ] Botão "Verificar" → calcula e exibe precisão
- [ ] Botão "Limpar" → reseta `userGrid`
- [ ] Destaque visual de células erradas (sutil, conforme doc)

---

## Etapa 7 — Estilo e experiência visual

- [ ] Aplicar Styled Components com paleta calma/neutra
- [ ] Layout desktop (dois grids lado a lado + paleta + botões + resultado)
- [ ] Layout mobile (empilhado)
- [ ] Microinterações suaves (hover, transições de cor)

---

## Etapa 8 — QA do MVP

- [ ] Testar fluxo completo: gerar → pintar → verificar → resultado → novo padrão
- [ ] Testar geração de várias pixel arts seguidas (checar variedade e validade)
- [ ] Testar em mobile (responsividade)
- [ ] Revisar mensagens de erro e estados vazios

---

## Pós-MVP (não fazer agora, apenas backlog)

- [ ] Pixelito (mascote com falas fixas)
- [ ] Modo relax (sem score)
- [ ] Desafio diário + banco de dados (PostgreSQL)
- [ ] Histórico e favoritos
- [ ] Exportar imagem (PNG)
- [ ] Multiplayer com WebSockets
