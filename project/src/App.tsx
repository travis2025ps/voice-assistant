import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { CustomerInterface } from './components/CustomerInterface';
import { AgentInterface } from './components/AgentInterface';
import { Query, User, LoginCredentials } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [queries, setQueries] = useState<Query[]>([]);

  // Demo credentials with more options
  const validCredentials = [
    // Customer credentials
    { name: 'john', password: 'customer123', role: 'customer' as const },
    { name: 'jane', password: 'customer123', role: 'customer' as const },
    { name: 'mike', password: 'customer123', role: 'customer' as const },
    { name: 'sarah', password: 'customer123', role: 'customer' as const },
    { name: 'customer', password: 'password', role: 'customer' as const },
    { name: 'demo', password: 'demo', role: 'customer' as const },
    
    // Agent credentials
    { name: 'agent1', password: 'agent123', role: 'agent' as const },
    { name: 'agent2', password: 'agent123', role: 'agent' as const },
    { name: 'support', password: 'support123', role: 'agent' as const },
    { name: 'admin', password: 'admin123', role: 'agent' as const },
    { name: 'agent', password: 'password', role: 'agent' as const },
  ];

  const authenticateUser = (credentials: LoginCredentials): boolean => {
    console.log('Attempting login with:', { 
      name: credentials.name, 
      role: credentials.role,
      passwordLength: credentials.password.length 
    });

    const isValid = validCredentials.some(cred => {
      const nameMatch = cred.name.toLowerCase().trim() === credentials.name.toLowerCase().trim();
      const passwordMatch = cred.password === credentials.password;
      const roleMatch = cred.role === credentials.role;
      
      console.log('Checking against:', {
        credName: cred.name,
        credRole: cred.role,
        nameMatch,
        passwordMatch,
        roleMatch
      });
      
      return nameMatch && passwordMatch && roleMatch;
    });

    console.log('Authentication result:', isValid);
    return isValid;
  };

  const handleLogin = useCallback((credentials: LoginCredentials) => {
    if (authenticateUser(credentials)) {
      setUser({
        name: credentials.name,
        role: credentials.role,
        password: credentials.password
      });
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  const handleSubmitQuery = useCallback((queryText: string) => {
    if (!user) return;

    const newQuery: Query = {
      id: `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerName: user.name,
      query: queryText,
      status: 'pending',
      timestamp: new Date()
    };

    setQueries(prev => [newQuery, ...prev]);
  }, [user]);

  const handleProvideSolution = useCallback((queryId: string, solution: string) => {
    setQueries(prev => 
      prev.map(query => 
        query.id === queryId 
          ? { ...query, solution, status: 'resolved' as const }
          : query
      )
    );
  }, []);

  if (!user) {
    return <LandingPage onLogin={handleLogin} validCredentials={validCredentials} />;
  }

  if (user.role === 'customer') {
    return (
      <CustomerInterface
        user={user}
        onLogout={handleLogout}
        queries={queries}
        onSubmitQuery={handleSubmitQuery}
      />
    );
  }

  return (
    <AgentInterface
      user={user}
      onLogout={handleLogout}
      queries={queries}
      onProvideSolution={handleProvideSolution}
    />
  );
}

export default App;