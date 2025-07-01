import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceVisualizerProps {
  isRecording: boolean;
  isSpeaking: boolean;
  isListening: boolean;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isRecording,
  isSpeaking,
  isListening
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <div className="relative">
        {isRecording ? (
          <>
            <Mic className="w-8 h-8 text-red-500" />
            <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-pulse" />
            <div className="absolute -inset-8 rounded-full bg-red-500/10 animate-ping" />
          </>
        ) : isListening ? (
          <MicOff className="w-8 h-8 text-gray-400" />
        ) : null}
      </div>

      {isSpeaking && (
        <div className="relative">
          <Volume2 className="w-8 h-8 text-blue-500" />
          <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse" />
          <div className="flex space-x-1 ml-4">
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <div className="w-1 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};