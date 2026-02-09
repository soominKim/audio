import { useState, useEffect, useRef, useCallback } from 'react';

// Basic type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseSpeechRecognitionProps {
  language?: string;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

export const useSpeechRecognition = (props: UseSpeechRecognitionProps = {}) => {
  const { language = 'ko-KR', onResult, onEnd } = props;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const accumulatedRef = useRef(''); // Stores text from previous auto-restarted sessions
  const currentSessionRef = useRef(''); // Stores text from current session
  const isUserListeningRef = useRef(false); // Tracks if user wants to listen

  useEffect(() => {
    // Check browser support
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionConstructor) {
      setError('Browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += (final ? ' ' : '') + event.results[i][0].transcript;
        } else {
          interim += (interim ? ' ' : '') + event.results[i][0].transcript;
        }
      }

      currentSessionRef.current = final;

      // Combine accumulated + current final
      const fullFinal = [accumulatedRef.current, final].filter(Boolean).join(' ');

      setTranscript(fullFinal);
      setInterimTranscript(interim);

      if (onResult && fullFinal) {
        onResult(fullFinal);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
          // Ignore no-speech error often
          return;
      }
      setError(event.error);
      // Don't set isListening to false here, let onend handle it
    };

    recognition.onend = () => {
      // If user still wants to listen, restart
      if (isUserListeningRef.current) {
          // Append current session to accumulated
          accumulatedRef.current = [accumulatedRef.current, currentSessionRef.current].filter(Boolean).join(' ');
          currentSessionRef.current = '';

          try {
              recognition.start();
          } catch(e) {
              console.log("Recognition restart failed", e);
              setIsListening(false);
          }
      } else {
          setIsListening(false);
          if (onEnd) onEnd();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
  }, [language]);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    accumulatedRef.current = '';
    currentSessionRef.current = '';
    isUserListeningRef.current = true;

    if (recognitionRef.current) {
      try {
        // Some browsers throw if already started
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start recognition", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    isUserListeningRef.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // isListening will be set to false in onend
    }
  }, []);

  const abortListening = useCallback(() => {
      isUserListeningRef.current = false;
      if (recognitionRef.current) {
          recognitionRef.current.abort();
          setIsListening(false);
      }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    abortListening
  };
};
