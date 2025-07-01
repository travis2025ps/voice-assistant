import React, { useState } from 'react';
import { Headphones, Send, Volume2, User, LogOut, MessageSquare } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { VoiceVisualizer } from './VoiceVisualizer';
import { Query, User as UserType } from '../types';

interface AgentInterfaceProps {
  user: UserType;
  onLogout: () => void;
  queries: Query[];
  onProvideSolution: (queryId: string, solution: string) => void;
}

export const AgentInterface: React.FC<AgentInterfaceProps> = ({
  user,
  onLogout,
  queries,
  onProvideSolution
}) => {
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [solution, setSolution] = useState('');
  const { isSpeaking, speak, stopSpeaking } = useVoice();

  const pendingQueries = queries.filter(q => q.status === 'pending');
  const inProgressQueries = queries.filter(q => q.status === 'in-progress');
  const resolvedQueries = queries.filter(q => q.status === 'resolved');

  const handleSelectQuery = (query: Query) => {
    setSelectedQuery(query);
    setSolution('');
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuery && solution.trim()) {
      onProvideSolution(selectedQuery.id, solution.trim());
      speak(`Solution provided for ${selectedQuery.customerName}'s query: ${solution.trim()}`);
      setSolution('');
      setSelectedQuery(null);
    }
  };

  const handleSpeakQuery = (query: string) => {
    speak(`Customer query: ${query}`);
  };

  const getQuerySection = (title: string, queryList: Query[], color: string) => (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-4">
      <h3 className={`text-lg font-semibold mb-4 ${color}`}>{title} ({queryList.length})</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {queryList.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No queries</p>
        ) : (
          queryList.map((query) => (
            <div
              key={query.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedQuery?.id === query.id
                  ? 'border-blue-500 bg-blue-900/30 shadow-blue-500/25'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650'
              }`}
              onClick={() => handleSelectQuery(query)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{query.customerName}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakQuery(query.query);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-400">
                    {query.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2">{query.query}</p>
              {query.solution && (
                <div className="mt-2 p-2 bg-green-900/30 rounded border border-green-500/50">
                  <p className="text-xs text-green-300 line-clamp-1">{query.solution}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Agent Dashboard - {user.name}</h1>
                <p className="text-gray-400">Customer Support Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <VoiceVisualizer isRecording={false} isSpeaking={isSpeaking} isListening={false} />
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors shadow-lg shadow-red-500/25"
                >
                  Stop
                </button>
              )}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {getQuerySection('Pending Queries', pendingQueries, 'text-amber-400')}
          {getQuerySection('In Progress', inProgressQueries, 'text-blue-400')}
          {getQuerySection('Resolved', resolvedQueries, 'text-green-400')}
        </div>

        {/* Solution Input */}
        {selectedQuery && (
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Provide Solution</h2>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6 border border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white">Customer: {selectedQuery.customerName}</h3>
                <button
                  onClick={() => handleSpeakQuery(selectedQuery.query)}
                  className="flex items-center space-x-1 px-2 py-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Listen to Query</span>
                </button>
              </div>
              <p className="text-gray-300">{selectedQuery.query}</p>
            </div>

            <form onSubmit={handleSubmitSolution} className="space-y-4">
              <div>
                <label htmlFor="solution" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Solution
                </label>
                <textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none text-white placeholder-gray-400"
                  rows={4}
                  placeholder="Provide a detailed solution for the customer's query..."
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!solution.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
                >
                  <Send className="w-4 h-4" />
                  <span>Provide Solution</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};