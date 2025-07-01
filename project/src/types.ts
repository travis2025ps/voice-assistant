export interface Query {
  id: string;
  customerName: string;
  query: string;
  status: 'pending' | 'in-progress' | 'resolved';
  solution?: string;
  timestamp: Date;
}

export interface User {
  name: string;
  role: 'customer' | 'agent';
  password: string;
}

export interface VoiceState {
  isListening: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;
}

export interface LoginCredentials {
  name: string;
  password: string;
  role: 'customer' | 'agent';
}