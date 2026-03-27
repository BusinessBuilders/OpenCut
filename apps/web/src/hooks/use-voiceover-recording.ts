"use client";

import { useState, useRef, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "stopped";

interface UseVoiceoverRecordingReturn {
  state: RecordingState;
  duration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  audioUrl: string | null;
  reset: () => void;
  error: string | null;
}

export function useVoiceoverRecording(): UseVoiceoverRecordingReturn {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setState("stopped");

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        if (timerRef.current !== null) {
          cancelAnimationFrame(timerRef.current);
          timerRef.current = null;
        }
      };

      recorder.start(100); // collect data every 100ms
      startTimeRef.current = Date.now();
      setState("recording");

      // Update duration continuously
      const updateDuration = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          setDuration((Date.now() - startTimeRef.current) / 1000);
          timerRef.current = requestAnimationFrame(updateDuration);
        }
      };
      timerRef.current = requestAnimationFrame(updateDuration);
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone access in your browser settings."
          : "Failed to start recording. Please check your microphone.";
      setError(message);
      setState("idle");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setState("idle");
    setError(null);
    chunksRef.current = [];
  }, [audioUrl]);

  return {
    state,
    duration,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    reset,
    error,
  };
}
