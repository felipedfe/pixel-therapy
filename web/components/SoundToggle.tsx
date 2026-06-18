"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./SoundToggle.module.css";

const VOLUME = 0.1;
const HINT_STORAGE_KEY = "pixel-therapy-sound-hint-seen";
const HINT_AUTO_DISMISS_MS = 6000;
const HINT_FADE_MS = 300;

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
      <audio ref={audioRef} src="/vintage-jazz.m4a" loop />
      {hintState !== "hidden" && (
        <div className={clsx(styles.hint, hintState === "shown" && styles.hintVisible)}>
          Listen while you paint
        </div>
      )}
      <button
        type="button"
        onClick={toggle}
        className={clsx(styles.toggleButton, isOn && styles.active)}
        aria-pressed={isOn}
        aria-label={isOn ? "Turn off music" : "Turn on music"}
        title={isOn ? "Music: on" : "Music: off"}
      >
        <SpeakerIcon muted={!isOn} />
      </button>
    </>
  );
}
