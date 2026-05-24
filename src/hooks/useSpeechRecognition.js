import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for Web Speech API live transcription.
 * Returns transcript, recording state, and controls.
 */
function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);

  const startRecording = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser. Try Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      const messages = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not found or not accessible.',
        'not-allowed': 'Microphone permission denied. Please allow access.',
        'network': 'Network error during recognition.',
      };
      setError(messages[event.error] || `Recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText('');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimText('');
    setError('');
  }, []);

  return {
    transcript,
    interimText,
    isRecording,
    isSupported,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript,
  };
}

export default useSpeechRecognition;
