import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PixelGrid } from "../components/PixelGrid";
import { ColorPalette } from "../components/ColorPalette";
import { ResultPanel } from "../components/ResultPanel";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { SoundToggle } from "../components/SoundToggle";
import type { GameState } from "../types/game";
import { createEmptyGrid, paintCell } from "../utils/grid";
import { calculateAccuracy, isCellWrong } from "../utils/compareGrids";
import { fetchPixelArtChallenge } from "../utils/api";

const Border = styled.div`
  border: 10px solid var(--color-border-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 50px;
  min-height: 100vh
`

const Container = styled.div`
  max-width: 880px;
  margin: 0 auto;
  /* padding: 32px 16px 64px; */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  border-bottom: 4px solid var(--color-success);
  padding-bottom: 4px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--color-text-soft);
`;

const GridsRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VerticalPaletteColumn = styled.div`
  display: none;
  align-items: center;
  justify-content: center;

  @media (min-width: 769px) {
    display: flex;
  }
`;

const HorizontalPaletteWrapper = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`;

const ColumnLabel = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-soft);
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.95rem;
  transition:
    background 0.15s ease,
    transform 0.1s ease;

  &:hover:not(:disabled) {
    background: var(--color-bg);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const PrimaryButton = styled(Button) <{ $active?: boolean }>`
  ${(props) =>
    props.$active &&
    `
      background: var(--color-success);
      border-color: var(--color-success);
      color: #fff;

      &:hover:not(:disabled) {
        background: var(--color-success);
        opacity: 0.9;
      }
    `}
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
`;

export function GamePage() {
  const [game, setGame] = useState<GameState>({
    challenge: null,
    userGrid: createEmptyGrid(),
    selectedColor: 1,
    score: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  async function loadNewChallenge() {
    setLoading(true);
    setError(null);

    try {
      const challenge = await fetchPixelArtChallenge();
      setGame({
        challenge,
        userGrid: createEmptyGrid(),
        selectedColor: 1,
        score: null,
      });
    } catch {
      setError("Could not generate a new pattern. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    loadNewChallenge();
  }, []);

  function handleCellClick(row: number, col: number) {
    setGame((prev) => {
      const isPainted = prev.userGrid[row][col] !== 0;
      const color = isPainted ? 0 : prev.selectedColor;

      return {
        ...prev,
        userGrid: paintCell(prev.userGrid, row, col, color),
        score: null,
      };
    });
  }

  function handleSelectColor(color: GameState["selectedColor"]) {
    setGame((prev) => ({ ...prev, selectedColor: color }));
  }

  function handleVerify() {
    if (!game.challenge) return;

    setGame((prev) => {
      if (prev.score !== null) {
        return { ...prev, score: null };
      }

      const accuracy = calculateAccuracy(prev.challenge!.grid, prev.userGrid);
      return { ...prev, score: accuracy };
    });
  }

  function handleClear() {
    setGame((prev) => ({ ...prev, userGrid: createEmptyGrid(), score: null }));
  }

  const wrongCells =
    game.challenge && game.score !== null
      ? game.challenge.grid.map((row, rowIndex) =>
        row.map((_, colIndex) => isCellWrong(game.challenge!.grid, game.userGrid, rowIndex, colIndex)),
      )
      : undefined;

  return (
    <Border>
      <SoundToggle />

      <Container>
        <Title>Pixel Therapy</Title>
        <Subtitle>Recreate the pattern using the same color palette.</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {game.challenge && (
          <>
            <GridsRow>
              <GridColumn>
                <ColumnLabel>Title: <strong>{game.challenge.title}</strong></ColumnLabel>
                <PixelGrid grid={game.challenge.grid} palette={game.challenge.palette} />
              </GridColumn>
              <VerticalPaletteColumn>
                <ColorPalette
                  palette={game.challenge.palette}
                  selectedColor={game.selectedColor}
                  onSelectColor={handleSelectColor}
                  vertical
                />
              </VerticalPaletteColumn>
              <GridColumn>
                <ColumnLabel>Your copy</ColumnLabel>
                <PixelGrid
                  grid={game.userGrid}
                  palette={game.challenge.palette}
                  editable
                  selectedColor={game.selectedColor}
                  onCellClick={handleCellClick}
                  wrongCells={wrongCells}
                />
              </GridColumn>
            </GridsRow>

            <Controls>
              <HorizontalPaletteWrapper>
                <ColorPalette
                  palette={game.challenge.palette}
                  selectedColor={game.selectedColor}
                  onSelectColor={handleSelectColor}
                />
              </HorizontalPaletteWrapper>

              <ButtonsRow>
                <PrimaryButton type="button" onClick={handleVerify} $active={game.score !== null}>
                  Check
                </PrimaryButton>
                <Button type="button" onClick={handleClear}>
                  Clear
                </Button>
                <Button type="button" onClick={loadNewChallenge} disabled={loading}>
                  {loading ? "Generating..." : "New pattern"}
                </Button>
              </ButtonsRow>

              {game.score !== null && <ResultPanel score={game.score} />}
            </Controls>
          </>
        )}

      </Container>

      {loading && <LoadingOverlay />}
    </Border>
  );
}
