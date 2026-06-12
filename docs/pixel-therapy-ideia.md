# Pixel Therapy — AI Pixel Art Copy Game

## Visão geral

Este projeto é um MVP de um app interativo/terapêutico inspirado em livros de colorir para adultos.

A ideia é simples:

1. O app gera uma pixel art abstrata em um grid 12x12 usando IA.
2. O usuário vê essa imagem como referência.
3. Ao lado, existe um grid vazio.
4. O usuário tenta reproduzir exatamente a imagem usando a mesma paleta de cores.
5. O app compara o grid original com o grid do usuário e mostra a porcentagem de acerto.

A experiência deve ser calma, visual, satisfatória e levemente desafiadora.

---

## Objetivo do MVP

Criar uma aplicação solo, sem multiplayer inicialmente, com:

* geração de pixel art abstrata via IA
* grid de referência 12x12
* grid editável 12x12
* paleta de cores dinâmica
* validação automática do resultado
* feedback de precisão
* botão para gerar novo desafio

---

## Stack sugerida

### Frontend

* React
* TypeScript
* Styled Components
* Opcional: Zustand para estado global

### Backend

* Node.js
* Express
* OpenAI API

### Banco de dados

No MVP, não precisa de banco.

Depois pode adicionar:

* PostgreSQL
* tabela de desafios gerados
* histórico do usuário
* favoritos
* desafios diários

---

## Estrutura básica

```txt
pixel-therapy/
  frontend/
    src/
      components/
        PixelGrid.tsx
        ColorPalette.tsx
        ResultPanel.tsx
      pages/
        GamePage.tsx
      types/
        pixelArt.ts
      utils/
        compareGrids.ts
  backend/
    src/
      server.ts
      routes/
        generatePixelArt.ts
      services/
        openaiService.ts
```

---

## Formato do desafio gerado pela IA

A IA é responsável **apenas pela composição (grid)**, não pela paleta de cores.

A paleta é escolhida pelo app a partir de um conjunto de paletas pré-definidas (ver seção "Paletas pré-definidas"). Isso garante que toda paleta usada seja bonita, acessível e harmoniosa, deixando a IA focada só na composição.

A IA deve retornar apenas JSON válido neste formato:

```json
{
  "title": "Abstract Pixel Flow",
  "grid": [
    [0,0,0,1,1,1,0,0,2,2,0,0],
    [0,0,1,1,3,1,1,0,2,4,2,0],
    [0,1,1,3,3,3,1,1,0,2,2,0],
    [0,1,3,3,0,3,3,1,0,0,2,0],
    [0,1,1,3,3,3,1,1,4,4,2,0],
    [0,0,1,1,3,1,1,4,4,2,0,0],
    [0,0,0,1,1,1,4,4,2,0,0,0],
    [0,2,2,0,0,4,4,2,2,2,0,0],
    [0,2,4,2,0,0,2,2,4,2,0,0],
    [0,0,2,2,2,2,2,4,2,0,0,0],
    [0,0,0,2,4,4,2,2,0,0,0,0],
    [0,0,0,0,2,2,0,0,0,0,0,0]
  ]
}
```

O backend combina esse `grid` com uma paleta escolhida (aleatoriamente, por exemplo) para montar o desafio final enviado ao frontend (formato `PixelArtChallenge`, com `title`, `palette` e `grid`).

---

## Regras da pixel art

* O grid sempre deve ter 12 linhas.
* Cada linha sempre deve ter 12 colunas.
* A IA só pode usar números de 0 a 4.
* O número 0 representa o fundo.
* A imagem deve ser abstrata.
* A composição deve ser visualmente interessante.
* Não gerar PNG, JPEG, SVG ou imagem.
* Não retornar markdown.
* Não retornar explicação.
* Apenas JSON válido.
* A IA não define a paleta de cores — isso é responsabilidade do app, a partir de paletas pré-definidas.

---

## Prompt para a IA

```txt
Você é uma API geradora de desafios de pixel art abstrata.

Retorne apenas JSON válido.
Não use markdown.
Não explique nada.
Não gere imagem, PNG, JPEG, SVG ou ASCII art.

Regras:
- Gere uma pixel art abstrata.
- O grid deve ter exatamente 12 linhas e 12 colunas.
- Use apenas os números 0, 1, 2, 3 e 4.
- O número 0 representa fundo.
- A composição deve ser visualmente interessante.
- Explore formas geométricas, curvas sugeridas, blocos de cor, linhas e áreas de cor.
- A cada geração, crie uma imagem diferente.
- Evite padrões muito aleatórios; a imagem deve parecer intencional.
- Evite muitos pixels isolados.
- Prefira massas de cor, ritmo visual e composição equilibrada.

Não gere paleta de cores — apenas a composição (grid).

Formato obrigatório:

{
  "title": "string",
  "grid": number[][]
}
```

---

## Endpoint do backend

### `POST /api/generate-pixel-art`

Gera um novo desafio de pixel art abstrata.

#### Response

```json
{
  "title": "Abstract Pixel Flow",
  "palette": {
    "0": "#F6F1E9",
    "1": "#2D3047",
    "2": "#FF6B6B",
    "3": "#FFD166",
    "4": "#4ECDC4"
  },
  "grid": [[0,0,0]]
}
```

---

## Importante sobre segurança

A chamada para a OpenAI API deve acontecer no backend.

Nunca chamar a OpenAI direto do frontend, porque isso expõe a API key.

Fluxo correto:

```txt
React
↓
Backend Node/Express
↓
OpenAI API
```

---

## Tipos TypeScript

```ts
export type PixelValue = 0 | 1 | 2 | 3 | 4;

export type PixelGrid = PixelValue[][];

export type PixelPalette = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
};

export type PixelArtChallenge = {
  title: string;
  palette: PixelPalette;
  grid: PixelGrid;
};
```

---

## Paletas pré-definidas

Em vez de a IA escolher as cores, o app mantém um conjunto de paletas curadas, garantindo que todas sejam bonitas, acessíveis e harmoniosas. A IA cuida apenas da composição (grid).

```ts
export const palettes: PixelPalette[] = [
  {
    "0": "#F8F3E2",
    "1": "#FCB944",
    "2": "#F0533B",
    "3": "#0E747C",
    "4": "#81B9BF"
  },
  {
    "0": "#FCEBB6",
    "1": "#5E412F",
    "2": "#78C0A8",
    "3": "#F07818",
    "4": "#F0A830"
  },
  {
    "0": "#F8F7DE",
    "1": "#9BBFA4",
    "2": "#E99E57",
    "3": "#D07746",
    "4": "#7E483A"
  },
  {
    "0": "#EADDCA",
    "1": "#95482C",
    "2": "#FFA37A",
    "3": "#88845F",
    "4": "#676966"
  },
  {
    "0": "#EEF0E7",
    "1": "#69604D",
    "2": "#BFD6D3",
    "3": "#8BB9B9",
    "4": "#284E57"
  },
  {
    "0": "#F1F1F2",
    "1": "#6864AD",
    "2": "#009FB8",
    "3": "#94C83D",
    "4": "#D21B6E"
  },
  {
    "0": "#FFFFFF",
    "1": "#091F26",
    "2": "#1D738B",
    "3": "#D0E0EF",
    "4": "#D33B52"
  },
  {
    "0": "#F4DED9",
    "1": "#F7623B",
    "2": "#FF8C29",
    "3": "#FFC627",
    "4": "#00C6FE"
  },
  {
    "0": "#FFE9C5",
    "1": "#FD65B2",
    "2": "#FFD2D7",
    "3": "#90E4CD",
    "4": "#84DCE0"
  }
  // adicionar mais paletas curadas aqui
];

export function pickRandomPalette(): PixelPalette {
  return palettes[Math.floor(Math.random() * palettes.length)];
}
```

O backend chama `pickRandomPalette()` e combina o resultado com o `grid` retornado pela IA para montar o `PixelArtChallenge` final.

---

## Estado do jogo

O frontend precisa manter:

```ts
type GameState = {
  challenge: PixelArtChallenge | null;
  userGrid: PixelGrid;
  selectedColor: PixelValue;
  score: number | null;
};
```

Quando um novo desafio é carregado:

* `challenge.grid` recebe o grid da IA
* `userGrid` começa vazio, preenchido com 0
* `selectedColor` começa em 1
* `score` começa como `null`

---

## Grid vazio do usuário

```ts
export function createEmptyGrid(size = 12): PixelGrid {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as PixelValue)
  );
}
```

---

## Componente PixelGrid

O mesmo componente pode ser usado para:

1. grid de referência
2. grid editável do usuário

Props sugeridas:

```ts
type PixelGridProps = {
  grid: PixelGrid;
  palette: PixelPalette;
  editable?: boolean;
  selectedColor?: PixelValue;
  onCellClick?: (row: number, col: number) => void;
};
```

Comportamento:

* Se `editable` for `false`, apenas renderiza o grid.
* Se `editable` for `true`, permite pintar células ao clicar.
* Cada célula usa a cor correspondente da paleta.

---

## Pintura do usuário

Ao clicar em uma célula do grid editável:

```ts
function paintCell(row: number, col: number) {
  setUserGrid(prev => {
    const next = prev.map(line => [...line]);
    next[row][col] = selectedColor;
    return next;
  });
}
```

---

## Paleta de cores

A paleta deve ser gerada com base no JSON retornado pela IA.

Cada botão representa uma cor.

Ao clicar em uma cor:

```ts
setSelectedColor(colorNumber);
```

Também seria interessante ter:

* indicador da cor selecionada
* botão borracha, usando a cor 0
* talvez hover preview

---

## Validação do resultado

A validação não usa IA.

Ela é feita comparando o grid original com o grid do usuário.

```ts
export function calculateAccuracy(
  targetGrid: PixelGrid,
  userGrid: PixelGrid
): number {
  let total = 0;
  let correct = 0;

  for (let row = 0; row < targetGrid.length; row++) {
    for (let col = 0; col < targetGrid[row].length; col++) {
      total++;

      if (targetGrid[row][col] === userGrid[row][col]) {
        correct++;
      }
    }
  }

  return Math.round((correct / total) * 100);
}
```

---

## Vitória

Para uma experiência mais terapêutica, não usar apenas “venceu/perdeu”.

Sugestões:

* 100%: “Perfeito!”
* 90–99%: “Quase perfeito!”
* 70–89%: “Muito bom!”
* abaixo de 70%: “Continue tentando!”

O app pode permitir:

* verificar resultado
* corrigir erros
* tentar novamente
* gerar novo desafio

---

## Mostrar erros

Depois que o usuário verifica o resultado, o app pode destacar as células erradas.

```ts
function isCellWrong(row: number, col: number) {
  return userGrid[row][col] !== challenge.grid[row][col];
}
```

Visualmente:

* borda vermelha
* outline
* brilho suave
* pequeno marcador

Evitar feedback agressivo.

---

## Fluxo principal do MVP

```txt
1. Usuário abre o app
2. Clica em "Gerar novo padrão"
3. Front chama POST /api/generate-pixel-art
4. Backend chama OpenAI API
5. Backend retorna JSON
6. Front renderiza o grid de referência
7. Front cria grid vazio para o usuário
8. Usuário escolhe cores na paleta
9. Usuário replica o padrão
10. Usuário clica em "Verificar"
11. App calcula precisão
12. App mostra feedback
13. Usuário pode tentar corrigir ou gerar outro padrão
```

---

## Funcionalidades extras para depois do MVP

### 1. Pixelito

Adicionar um mascote chamado Pixelito.

Ele pode comentar:

* quando o desafio começa
* quando o usuário verifica o resultado
* quando o usuário acerta 100%
* quando gera um novo padrão

Exemplo:

```txt
Pixelito diz:
“Esse padrão parece um jardim visto de cima!”
```

No MVP, os textos podem ser fixos.

Depois, podem ser gerados por IA.

---

### 2. Modo relax

Sem pontuação visível.

Apenas:

* copiar
* pintar
* concluir
* receber mensagem positiva

---

### 3. Desafio diário

Gerar um único padrão por dia e salvar no banco.

---

### 4. Histórico

Salvar padrões já feitos pelo usuário.

---

### 5. Favoritos

Permitir favoritar padrões bonitos.

---

### 6. Exportar imagem

Permitir baixar o grid final como PNG.

---

### 7. Multiplayer futuro

Versão futura com WebSockets:

* sala compartilhada
* várias pessoas copiando o mesmo grid
* colaboração em tempo real
* cada pessoa pinta parte do padrão

---

## Critérios de qualidade da geração

A geração da IA deve ser considerada boa quando:

* o JSON é válido
* o grid tem exatamente 12x12
* usa apenas valores de 0 a 4
* a imagem parece intencional
* existe contraste suficiente
* não parece ruído aleatório
* há áreas de cor interessantes
* o padrão é prazeroso de copiar

---

## Validação do JSON no backend

O backend deve validar a resposta da IA antes de enviar ao frontend.

Checar na resposta da IA:

* existe `title`
* existe `grid`
* `grid.length === 12`
* cada linha tem `length === 12`
* todos os valores são números entre 0 e 4

A paleta não vem da IA, então não precisa ser validada: o backend escolhe uma paleta pronta da lista pré-definida (ver "Paletas pré-definidas") e a combina com o grid.

Se a IA retornar algo inválido:

* tentar gerar novamente
* ou retornar erro controlado para o frontend

---

## Ideia de experiência visual

O app deve parecer calmo e agradável.

Referências de sensação:

* livro de colorir
* puzzle visual
* app de relaxamento
* pixel art
* brinquedo digital
* ferramenta criativa

Evitar aparência de jogo competitivo demais.

### Posicionamento / diferencial

A ideia lembra mais um cruzamento entre:

* livro de colorir
* tangram
* memory game visual
* puzzle zen

do que um jogo tradicional. Esse cruzamento pode ser um diferencial interessante na apresentação do projeto.

---

## Layout sugerido

Desktop:

```txt
-------------------------------------------------
| Pixel Pattern                                  |
|-----------------------------------------------|
| Referência              | Sua cópia           |
| [grid 12x12]            | [grid 12x12]        |
|                         |                     |
| Paleta: [ ] [ ] [ ] [ ] [ ]                   |
|                                               |
| [Verificar] [Limpar] [Novo padrão]            |
|                                               |
| Resultado: 94% de precisão                    |
-------------------------------------------------
```

Mobile:

```txt
Pixel Pattern

Referência
[grid]

Sua cópia
[grid]

Paleta
[cores]

Botões
```

---

## Primeira entrega esperada

Implementar:

* backend com endpoint de geração
* integração com OpenAI
* frontend com dois grids
* paleta dinâmica
* pintura manual
* botão verificar
* cálculo de precisão
* botão gerar novo padrão

Não implementar ainda:

* login
* banco
* multiplayer
* webcam
* ranking
* exportação
* histórico
