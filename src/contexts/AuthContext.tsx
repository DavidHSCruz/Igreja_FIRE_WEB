import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

type Atividade = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  atuacaoId?: string;
  papel?: string;
};

type Ministerio = {
  id: string;
  name: string;
  description?: string;
  papel: string;
  atividades: Atividade[];
};

type Area = {
  id: string;
  name: string;
  description?: string;
  papel: string;
  atividades: Atividade[];
};

type Escala = {
  id: string;
  data: string;
  evento: string;
  atividade: Atividade;
  local: string;
  tipo: string;
};

export interface User {
  id: string;
  email: string;
  systemRole: string;
  avatarUrl?: string;
  membro?: {
    id: string;
    nome: string;
    email: string;
    dataNascimento: string;
    color?: string;
    ministerios?: Ministerio[];
    areas?: Area[];
    escalas?: Escala[];
  };
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateLocalUser: (updatedUser: User) => void;
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

  const updateLocalUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    updateLocalUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentUser = user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);
      
      if (!token || !currentUser?.id) return;

      const response = await api.get(`/users/${currentUser.id}/complete-profile`);
      const updatedUser = response.data;
      
      updateLocalUser(updatedUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, refreshUser, updateLocalUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
