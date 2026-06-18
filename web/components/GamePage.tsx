"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PixelGrid } from "./PixelGrid";
import { ColorPalette } from "./ColorPalette";
import { ResultPanel } from "./ResultPanel";
import { LoadingOverlay } from "./LoadingOverlay";
import { SoundToggle } from "./SoundToggle";
import type { GameState } from "@/types/game";
import { createEmptyGrid, paintCell } from "@/lib/grid";
import { calculateAccuracy, isCellWrong } from "@/lib/compareGrids";
import { fetchPixelArtChallenge } from "@/lib/api";
import styles from "./GamePage.module.css";

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
    <div className={styles.border}>
      <SoundToggle ready={!loading && game.challenge !== null} />

      <div className={styles.container}>
        <h1 className={styles.title}>Pixel Therapy</h1>
        <p className={styles.subtitle}>Observe carefully and recreate the piece.</p>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {game.challenge && (
          <>
            <div className={styles.gridsRow}>
              <div className={styles.gridColumn}>
                <span className={styles.columnLabel}>
                  Title: <strong className={styles.columnLabelTitle}>{game.challenge.title}</strong>
                </span>
                <PixelGrid grid={game.challenge.grid} palette={game.challenge.palette} />
              </div>
              <div className={styles.verticalPaletteColumn}>
                <ColorPalette
                  palette={game.challenge.palette}
                  selectedColor={game.selectedColor}
                  onSelectColor={handleSelectColor}
                  vertical
                />
              </div>
              <div className={styles.gridColumn}>
                <span className={styles.columnLabel}>Your copy</span>
                <PixelGrid
                  grid={game.userGrid}
                  palette={game.challenge.palette}
                  editable
                  selectedColor={game.selectedColor}
                  onCellClick={handleCellClick}
                  wrongCells={wrongCells}
                />
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.horizontalPaletteWrapper}>
                <ColorPalette
                  palette={game.challenge.palette}
                  selectedColor={game.selectedColor}
                  onSelectColor={handleSelectColor}
                />
              </div>

              <div className={styles.buttonsRow}>
                <button
                  type="button"
                  className={clsx(styles.button, game.score !== null && styles.primaryButtonActive)}
                  onClick={handleVerify}
                >
                  Check
                </button>
                <button type="button" className={styles.button} onClick={handleClear}>
                  Clear
                </button>
                <button type="button" className={styles.button} onClick={loadNewChallenge} disabled={loading}>
                  {loading ? "Generating..." : "New Piece"}
                </button>
              </div>

              {game.score !== null && <ResultPanel score={game.score} />}
            </div>
          </>
        )}
      </div>

      {loading && <LoadingOverlay />}
    </div>
  );
}
