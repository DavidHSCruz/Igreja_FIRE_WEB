import { useState, FormEvent } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const LoginMembro = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      navigate('/areamembro');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Falha no login. Verifique suas credenciais.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-quaternary flex flex-col items-center justify-center p-4 font-montserrat">
      <div className="w-full max-w-[400px]">
        {isLogin ? (
          // Login Form
          <div className="bg-[#131313] p-8 rounded-[30px] shadow-2xl border border-white/5 relative overflow-hidden">
            <h2 className="text-3xl text-primary font-normal mb-8 text-center">Sign in</h2>
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">{error}</div>}
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-primary z-10">
                  <FaUser className="text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 pl-16 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary h-14"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-primary z-10">
                  <FaLock className="text-lg" />
                </div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 pl-16 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary h-14"
                  required
                />
              </div>

              <div className="flex justify-start items-center text-sm pt-2">
                <button
                  type="button"
                  className="text-primary opacity-80 hover:opacity-100 hover:text-secondary underline decoration-1 underline-offset-2 transition-all"
                >
                  Esqueci a senha?
                </button>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 mt-4 uppercase tracking-wide disabled:opacity-50"
              >
                {isLoading ? 'ENTRANDO...' : 'LOGIN'}
              </button>
            </form>

            <div className="mt-12 text-center text-primary text-sm opacity-90">
              Não é membro?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary font-bold hover:text-secondary underline decoration-1 underline-offset-2 ml-1"
              >
                CADASTRE-SE
              </button>
            </div>
          </div>
        ) : (
          // Cadastro Form
          <div className="bg-[#131313] p-8 rounded-[30px] shadow-2xl border border-white/5">
            <h2 className="text-3xl text-primary font-normal mb-8">Cadastro</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                placeholder="Data de nascimento"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
              />

              <div className="flex items-center gap-2 text-xs text-primary my-4 opacity-90">
                <input
                  type="checkbox"
                  id="terms"
                  className="accent-secondary w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="terms">
                  Eu concordo com os{' '}
                  <Link to="#" className="underline hover:text-secondary">
                    Termos
                  </Link>
                  .
                </label>
              </div>

              <button className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 uppercase tracking-wide">
                CADASTRAR
              </button>
            </form>
            <p className="mt-6 text-center text-primary text-sm opacity-90">
              Já tem conta?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary font-bold hover:text-secondary underline decoration-1 underline-offset-2 ml-1"
              >
                FAZER LOGIN
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
