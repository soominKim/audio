"use client";

import React, { useState, useEffect, useRef } from "react";
import LandingView from "./LandingView";
import RecordingView from "./RecordingView";
import ResultView from "./ResultView";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { RecordingSession } from "../types/recording";

type AppState = 'idle' | 'recording' | 'paused' | 'processed';

const VoiceRecorder: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [language, setLanguage] = useState('ko-KR');
  const [fullTranscript, setFullTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [history, setHistory] = useState<RecordingSession[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('voiceRecHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveRecording = (transcript: string, duration: number) => {
    if (!transcript.trim()) return;

    const newSession: RecordingSession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      transcript: transcript,
      duration: duration,
      language: language
    };

    const newHistory = [newSession, ...history];
    setHistory(newHistory);
    localStorage.setItem('voiceRecHistory', JSON.stringify(newHistory));
  };

  const {
    isListening,
    transcript: currentTranscript,
    interimTranscript,
    startListening,
    stopListening,
    abortListening
  } = useSpeechRecognition({
    language,
    onEnd: () => {
        // When recognition ends, we check if we should restart or just update state
        // But here we handle state transitions via buttons mostly.
        // If it stops unexpectedly (e.g. silence), we might want to update UI or auto-restart?
        // For this app, let's assume manual control mostly.
    }
  });

  // Timer logic
  useEffect(() => {
    if (appState === 'recording') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appState]);

  const handleStart = () => {
    setFullTranscript('');
    setTimer(0);
    setAppState('recording');
    startListening();
  };

  const handlePause = () => {
    if (appState === 'recording') {
      setAppState('paused');
      stopListening();
      // Add current session transcript to full transcript
      // Note: currentTranscript is state from hook. It might not be immediately updated if onResult just fired.
      // But typically it is.
      // Actually, we should use the value from hook.
      // But hook resets on start. So we must save it now.
      setFullTranscript(prev => (prev ? prev + ' ' : '') + currentTranscript);
    } else if (appState === 'paused') {
      setAppState('recording');
      startListening();
    }
  };

  const handleStop = () => {
    if (appState === 'recording' || appState === 'paused') {
      stopListening();
      setAppState('processed');

      // Calculate final transcript
      let finalTranscript = fullTranscript;
      if (appState === 'recording') {
         finalTranscript = (finalTranscript ? finalTranscript + ' ' : '') + currentTranscript;
         setFullTranscript(finalTranscript);
      }

      // Save to history
      saveRecording(finalTranscript, timer);
    }
  };

  const handleNewRecording = () => {
    setAppState('idle');
    setFullTranscript('');
    setTimer(0);
    abortListening();
  };

  // Combine transcripts for display
  // If recording, show full + current + interim
  // If paused, show full (because current is added to full on pause)
  // If processed, show full
  const displayTranscript =
    appState === 'recording'
      ? (fullTranscript ? fullTranscript + ' ' : '') + currentTranscript + (interimTranscript ? ' ' + interimTranscript : '')
      : fullTranscript;

  return (
    <>
      {appState === 'idle' && (
        <LandingView
          onStartRecording={handleStart}
          onLanguageChange={setLanguage}
          language={language}
        />
      )}
      {(appState === 'recording' || appState === 'paused') && (
        <RecordingView
          onStop={handleStop}
          onPause={handlePause}
          isPaused={appState === 'paused'}
          transcriptPreview={displayTranscript}
          duration={timer}
        />
      )}
      {appState === 'processed' && (
        <ResultView
          transcript={fullTranscript}
          duration={formatTime(timer)}
          onNewRecording={handleNewRecording}
          language={language}
          history={history}
        />
      )}
    </>
  );
};

export default VoiceRecorder;
