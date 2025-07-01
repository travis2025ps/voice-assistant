import React, { useState, useEffect } from 'react';
import { Mic, Send, Clock, CheckCircle, User, LogOut } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { VoiceVisualizer } from './VoiceVisualizer';
import { Query, User as UserType } from '../types';

interface CustomerInterfaceProps {
  user: UserType;
  onLogout: () => void;
  queries: Query[];
  onSubmitQuery: (query: string) => void;
}

export const CustomerInterface: React.FC<CustomerInterfaceProps> = ({
  user,
  onLogout,
  queries,
  onSubmitQuery
}) => {
  const [currentQuery, setCurrentQuery] = useState('');
  const { 
    isListening, 
    isRecording, 
    isSpeaking, 
    transcript, 
    error, 
    startListening, 
    stopListening,
    speak 
  } = useVoice();

  const userQueries = queries.filter(q => q.customerName === user.name);
  const latestQuery = userQueries[0];

  useEffect(() => {
    if (transcript) {
      setCurrentQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (latestQuery?.solution && latestQuery.status === 'resolved') {
      speak(`Here's the solution to your query: ${latestQuery.solution}`);
    }
  }, [latestQuery?.solution, latestQuery?.status, speak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      onSubmitQuery(currentQuery.trim());
      setCurrentQuery('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-900/50 text-amber-300 border-amber-500/50';
      case 'in-progress': return 'bg-blue-900/50 text-blue-300 border-blue-500/50';
      case 'resolved': return 'bg-green-900/50 text-green-300 border-green-500/50';
      default: return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
                <p className="text-gray-400">Customer Support Portal</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Query Input */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Submit Your Query</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
                  What can we help you with?
                </label>
                <textarea
                  id="query"
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-white placeholder-gray-400"
                  rows={4}
                  placeholder="Type your query or use voice input..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={isRecording ? stopListening : startListening}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? 'Stop Recording' : 'Voice Input'}</span>
                  </button>
                  
                  <VoiceVisualizer 
                    isRecording={isRecording} 
                    isSpeaking={isSpeaking} 
                    isListening={isListening} 
                  />
                </div>

                <button
                  type="submit"
                  disabled={!currentQuery.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Query</span>
                </button>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Query History */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Your Queries</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userQueries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No queries submitted yet</p>
                </div>
              ) : (
                userQueries.map((query) => (
                  <div key={query.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(query.status)}`}>
                        {getStatusIcon(query.status)}
                        <span className="capitalize">{query.status.replace('-', ' ')}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {query.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-white mb-3 font-medium">Query:</p>
                    <p className="text-gray-300 mb-4">{query.query}</p>
                    
                    {query.solution && (
                      <>
                        <p className="text-white mb-2 font-medium">Solution:</p>
                        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                          <p className="text-green-300">{query.solution}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};