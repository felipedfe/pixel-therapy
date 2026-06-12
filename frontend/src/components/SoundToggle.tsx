import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ambientTrack from "../assets/vintage-jazz.m4a";

const VOLUME = 0.10;

const ToggleButton = styled.button<{ $active: boolean }>`
  position: fixed;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
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

export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = VOLUME;
    }
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isOn) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsOn(!isOn);
  }

  return (
    <>
      <audio ref={audioRef} src={ambientTrack} loop />
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
