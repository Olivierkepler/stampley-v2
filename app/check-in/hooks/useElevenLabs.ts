"use client";

import { useState, useRef, useCallback } from "react";

export function useElevenLabs() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopVoice = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  const playVoice = useCallback(async (text: string) => {
    if (isMuted || !text) return;

    try {
      stopVoice();
      setIsSpeaking(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        let message = "TTS fetch failed";
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          try {
            const data = await res.json();
            message = (data.message ?? data.error ?? message) as string;
          } catch {
            // use default message
          }
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = url;
      audioRef.current.play();

      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error("ElevenLabs Error:", err);
      setIsSpeaking(false);
    }
  }, [isMuted, stopVoice]);

  const toggleMute = () => setIsMuted((prev) => !prev);

  return { playVoice, stopVoice, isSpeaking, isMuted, toggleMute };
}