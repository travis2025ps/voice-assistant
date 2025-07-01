import React, { useState } from 'react';
import { User, Headphones, MessageSquare, ArrowRight, Eye, EyeOff, AlertCircle, Copy, Check } from 'lucide-react';
import { LoginCredentials } from '../types';

interface LandingPageProps {
  onLogin: (credentials: LoginCredentials) => boolean;
  validCredentials: Array<{ name: string; password: string; role: 'customer' | 'agent' }>;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, validCredentials }) => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'agent' | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim() || !selectedRole) return;

    setIsLoading(true);
    setError('');

    const credentials: LoginCredentials = {
      name: name.trim(),
      password: password.trim(),
      role: selectedRole
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = onLogin(credentials);
    
    if (!success) {
      setError('Invalid credentials. Please check your username and password, or use one of the demo credentials below.');
    }
    
    setIsLoading(false);
  };

  const resetForm = () => {
    setName('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleRoleSelect = (role: 'customer' | 'agent') => {
    setSelectedRole(role);
    resetForm();
  };

  const copyCredentials = async (name: string, password: string) => {
    try {
      await navigator.clipboard.writeText(`${name}:${password}`);
      setCopiedCredential(`${name}:${password}`);
      setTimeout(() => setCopiedCredential(null), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.log('Clipboard not supported');
    }
  };

  const useCredentials = (name: string, password: string) => {
    setName(name);
    setPassword(password);
    setError('');
  };

  const getCredentialsForRole = (role: 'customer' | 'agent') => {
    return validCredentials.filter(cred => cred.role === role).slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Voice Support System
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Connect customers with agents through intelligent voice-powered support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedRole === 'customer'
                ? 'transform scale-105 shadow-2xl'
                : 'hover:transform hover:scale-102 hover:shadow-xl'
            }`}
            onClick={() => handleRoleSelect('customer')}
          >
            <div className={`bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === 'customer'
                ? 'border-blue-500 bg-blue-900/20 shadow-blue-500/20'
                : 'border-gray-700 hover:border-blue-400 hover:bg-gray-750'
            }`}>
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Customer</h3>
              <p className="text-gray-300 mb-6">
                Need help? Speak your query and get instant support from our agents.
              </p>
              <div className="flex items-center text-blue-400 font-medium">
                Get Support
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          <div
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedRole === 'agent'
                ? 'transform scale-105 shadow-2xl'
                : 'hover:transform hover:scale-102 hover:shadow-xl'
            }`}
            onClick={() => handleRoleSelect('agent')}
          >
            <div className={`bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedRole === 'agent'
                ? 'border-purple-500 bg-purple-900/20 shadow-purple-500/20'
                : 'border-gray-700 hover:border-purple-400 hover:bg-gray-750'
            }`}>
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mb-6 shadow-lg">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Agent</h3>
              <p className="text-gray-300 mb-6">
                Help customers by providing solutions and voice responses to their queries.
              </p>
              <div className="flex items-center text-purple-400 font-medium">
                Start Helping
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {selectedRole && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Login Form */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Login as {selectedRole}
                </h3>
                <p className="text-gray-400 text-sm">
                  Enter your credentials or use demo accounts →
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white placeholder-gray-400"
                    placeholder={`Your ${selectedRole} username`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white placeholder-gray-400 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !name.trim() || !password.trim()}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedRole === 'customer'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                  } transform hover:scale-105 active:scale-95 shadow-lg`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    `Login as ${selectedRole}`
                  )}
                </button>
              </form>
            </div>

            {/* Demo Credentials */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700 animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-6">
                Demo {selectedRole} Accounts
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Click on any credential to use it, or copy to clipboard
              </p>
              
              <div className="space-y-3">
                {getCredentialsForRole(selectedRole).map((cred, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{cred.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-300 font-mono text-sm">{cred.password}</span>
                        </div>
                        <p className="text-gray-400 text-xs capitalize">{cred.role} account</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyCredentials(cred.name, cred.password)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Copy credentials"
                        >
                          {copiedCredential === `${cred.name}:${cred.password}` ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => useCredentials(cred.name, cred.password)}
                          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                            selectedRole === 'customer'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          Use
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="text-gray-300 text-sm">
                  <strong>Quick Test:</strong> Try username <code className="bg-gray-600 px-1 rounded">demo</code> with password <code className="bg-gray-600 px-1 rounded">demo</code> for customer, or <code className="bg-gray-600 px-1 rounded">agent</code> with <code className="bg-gray-600 px-1 rounded">password</code> for agent.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};