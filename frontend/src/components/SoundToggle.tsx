import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ambientTrack from "../assets/vintage-jazz.m4a";

const VOLUME = 0.10;
const HINT_STORAGE_KEY = "pixel-therapy-sound-hint-seen";
const HINT_AUTO_DISMISS_MS = 6000;
const HINT_FADE_MS = 300;

const BUTTON_SIZE = 40;
const BUTTON_OFFSET = 40;
const HINT_GAP = 8;
const HINT_ARROW_SIZE = 10;

const ToggleButton = styled.button<{ $active: boolean }>`
  position: fixed;
  top: ${BUTTON_OFFSET}px;
  right: ${BUTTON_OFFSET}px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;

  &:hover {
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$active &&
    `
      background: var(--color-success);
      border-color: var(--color-success);
      color: #fff;
    `}
`;

const Hint = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: ${BUTTON_OFFSET + BUTTON_SIZE + HINT_GAP}px;
  right: ${BUTTON_OFFSET}px;
  max-width: 170px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--color-border-dark);
  color: var(--color-surface);
  font-size: 0.8rem;
  line-height: 1.4;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 11;
  pointer-events: none;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: translateY(${(props) => (props.$visible ? "0" : "-4px")});
  transition:
    opacity ${HINT_FADE_MS}ms ease,
    transform ${HINT_FADE_MS}ms ease;

  &::after {
    content: "";
    position: absolute;
    top: -${HINT_ARROW_SIZE / 2}px;
    right: ${BUTTON_SIZE / 2 - HINT_ARROW_SIZE / 2}px;
    width: ${HINT_ARROW_SIZE}px;
    height: ${HINT_ARROW_SIZE}px;
    background: var(--color-border-dark);
    transform: rotate(45deg);
  }
`;

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" stroke="none" />
      {muted ? (
        <>
          <line x1="16" y1="9" x2="22" y2="15" />
          <line x1="22" y1="9" x2="16" y2="15" />
        </>
      ) : (
        <>
          <path d="M16 8a5 5 0 0 1 0 8" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </>
      )}
    </svg>
  );
}

export function SoundToggle({ ready }: { ready: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [hintState, setHintState] = useState<"hidden" | "shown" | "hiding">("hidden");

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = VOLUME;
    }
  }, []);

  useEffect(() => {
    if (!ready || localStorage.getItem(HINT_STORAGE_KEY)) return;

    const showTimeout = setTimeout(() => setHintState("shown"), 50);
    return () => clearTimeout(showTimeout);
  }, [ready]);

  useEffect(() => {
    if (hintState !== "shown") return;

    const hideTimeout = setTimeout(dismissHint, HINT_AUTO_DISMISS_MS);
    return () => clearTimeout(hideTimeout);
  }, [hintState]);

  function dismissHint() {
    setHintState("hiding");
    localStorage.setItem(HINT_STORAGE_KEY, "1");
    setTimeout(() => setHintState("hidden"), HINT_FADE_MS);
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isOn) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsOn(!isOn);

    if (hintState === "shown") dismissHint();
  }

  return (
    <>
      <audio ref={audioRef} src={ambientTrack} loop />
      {hintState !== "hidden" && <Hint $visible={hintState === "shown"}>Listen while you paint</Hint>}
      <ToggleButton
        type="button"
        onClick={toggle}
        $active={isOn}
        aria-pressed={isOn}
        aria-label={isOn ? "Turn off music" : "Turn on music"}
        title={isOn ? "Music: on" : "Music: off"}
      >
        <SpeakerIcon muted={!isOn} />
      </ToggleButton>
    </>
  );
}
