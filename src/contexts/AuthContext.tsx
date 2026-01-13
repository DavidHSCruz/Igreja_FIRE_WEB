import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  systemRole: string;
  membro?: {
    id: string;
    nome: string;
    email: string;
    dataNascimento: string;
    // Add other fields as needed
  };
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (recoveredUser && token) {
      try {
        setUser(JSON.parse(recoveredUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
