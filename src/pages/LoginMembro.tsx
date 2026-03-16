import { useState, FormEvent } from "react";
import type { AxiosError } from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAppDispatch } from "../store/hooks";
import { loginWithPassword } from "../store/slices/authSlice";

const getApiErrorMessage = (error: unknown): string | null => {
  const axiosError = error as AxiosError<unknown>;
  const data = axiosError.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return null;
};

export const LoginMembro = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Register States
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTerms, setRegTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // TODO: Termos de Uso Content, interessante levar o conteudo para o backend /terms
  const termsContent = (
    <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
      <p>
        Bem-vindo à <strong>Igreja Fire</strong>. Ao se cadastrar em nossa
        plataforma, você concorda com os seguintes termos:
      </p>

      <h3 className="text-white font-bold text-base mt-4">
        1. Uso da Plataforma
      </h3>
      <p>
        Esta plataforma é destinada à organização interna, comunicação e
        edificação dos membros da Igreja Fire. O uso é pessoal e intransferível.
      </p>

      <h3 className="text-white font-bold text-base mt-4">
        2. Privacidade de Dados
      </h3>
      <p>
        Seus dados pessoais (nome, telefone, endereço) serão utilizados
        exclusivamente para fins de gestão eclesiástica e comunicação da
        liderança. Comprometemo-nos a não compartilhar suas informações com
        terceiros sem seu consentimento.
      </p>

      <h3 className="text-white font-bold text-base mt-4">
        3. Conduta e Respeito
      </h3>
      <p>
        Esperamos que todos os membros mantenham uma conduta cristã, respeitosa
        e ética em todas as interações dentro da plataforma (comentários,
        mensagens, etc.). Discursos de ódio, desrespeito ou conteúdo impróprio
        não serão tolerados.
      </p>

      <h3 className="text-white font-bold text-base mt-4">
        4. Direitos de Imagem
      </h3>
      <p>
        Ao participar de eventos da igreja, você está ciente de que fotos e
        vídeos podem ser registrados e utilizados na plataforma para fins de
        divulgação das atividades da igreja.
      </p>

      <h3 className="text-white font-bold text-base mt-4">5. Cancelamento</h3>
      <p>
        Você pode solicitar a exclusão da sua conta a qualquer momento entrando
        em contato com a secretaria da igreja.
      </p>
    </div>
  );

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!regTerms) {
      setError("Você precisa aceitar os Termos para se cadastrar.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criar Usuário
      await api.post("/users", {
        email: regEmail,
        password: regPassword,
      });

      await dispatch(
        loginWithPassword({ email: regEmail, password: regPassword }),
      ).unwrap();
      navigate("/areamembro");
    } catch (err: unknown) {
      console.error(err);
      setError(getApiErrorMessage(err) || "Erro ao realizar cadastro.");
      setIsLoading(false);
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await dispatch(loginWithPassword({ email, password })).unwrap();
      navigate("/areamembro");
    } catch (err: unknown) {
      console.error(err);
      setError(
        getApiErrorMessage(err) ||
          "Falha no login. Verifique suas credenciais.",
      );
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
            <h2 className="text-3xl text-primary font-normal mb-8 text-center">
              Sign in
            </h2>
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

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
                {isLoading ? "ENTRANDO..." : "LOGIN"}
              </button>
            </form>

            <div className="mt-12 text-center text-primary text-sm opacity-90">
              Não é membro?{" "}
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
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirmar senha"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                className="w-full bg-[#D9D9D9] text-black placeholder-gray-500 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                minLength={6}
              />

              <div className="flex items-center gap-2 text-xs text-primary my-4 opacity-90">
                <input
                  type="checkbox"
                  id="terms"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  className="accent-secondary w-4 h-4 rounded border-gray-300"
                  required
                />
                <label htmlFor="terms">
                  Eu concordo com os{" "}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="underline hover:text-secondary bg-transparent border-none p-0 cursor-pointer inline text-xs text-primary font-normal"
                  >
                    Termos de Uso
                  </button>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary text-primary font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 mt-4 uppercase tracking-wide disabled:opacity-50"
              >
                {isLoading ? "CADASTRANDO..." : "CADASTRAR"}
              </button>
            </form>

            <div className="mt-8 text-center text-primary text-sm opacity-90">
              Já é membro?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-primary font-bold hover:text-secondary underline decoration-1 underline-offset-2 ml-1"
              >
                FAZER LOGIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Termos de Uso */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#131313] w-full max-w-lg rounded-[30px] shadow-2xl border border-white/5 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a] rounded-t-[30px]">
              <h2 className="text-xl font-bold text-white">Termos de Uso</h2>
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {termsContent}
            </div>

            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] rounded-b-[30px] flex justify-end">
              <button
                onClick={() => {
                  setRegTerms(true);
                  setIsTermsModalOpen(false);
                }}
                className="bg-secondary text-primary font-bold py-2 px-6 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20"
              >
                Li e Concordo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
