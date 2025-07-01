import { useState, useEffect, useCallback } from 'react';
import { VoiceState } from '../types';

export const useVoice = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isRecording: false,
    isSpeaking: false,
    transcript: '',
    error: null
  });

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
    }

    if ('speechSynthesis' in window) {
      setSynthesis(window.speechSynthesis);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setVoiceState(prev => ({ ...prev, error: 'Speech recognition not supported' }));
      return;
    }

    setVoiceState(prev => ({ 
      ...prev, 
      isListening: true, 
      isRecording: true, 
      error: null,
      transcript: ''
    }));

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setVoiceState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript
      }));
    };

    recognition.onerror = (event) => {
      setVoiceState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`,
        isListening: false,
        isRecording: false
      }));
    };

    recognition.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        isRecording: false
      }));
    };

    recognition.start();
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setVoiceState(prev => ({
      ...prev,
      isListening: false,
      isRecording: false
    }));
  }, [recognition]);

  const speak = useCallback((text: string) => {
    if (!synthesis) {
      setVoiceState(prev => ({ ...prev, error: 'Speech synthesis not supported' }));
      return;
    }

    synthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = () => {
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Speech synthesis error',
        isSpeaking: false 
      }));
    };

    synthesis.speak(utterance);
  }, [synthesis]);

  const stopSpeaking = useCallback(() => {
    if (synthesis) {
      synthesis.cancel();
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, [synthesis]);

  return {
    ...voiceState,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
};