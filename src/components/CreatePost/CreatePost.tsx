import { useState } from "react";
import { FaPaperPlane, FaSpinner, FaPlus, FaTimes } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

interface CreatePostProps {
  onPostCreated?: () => void;
  defaultType?: "geral" | "area" | "ministerio";
  defaultTargetId?: string;
  fixedContext?: boolean;
  contextName?: string;
}

export const CreatePost = ({ 
  onPostCreated, 
  defaultType = "geral", 
  defaultTargetId = "", 
  fixedContext = false,
  contextName
}: CreatePostProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState<"geral" | "area" | "ministerio">(defaultType);
  const [targetId, setTargetId] = useState(defaultTargetId);
  const [error, setError] = useState("");

  const areas = user?.membro?.areas || [];
  const ministerios = user?.membro?.ministerios || [];

  // Permissões
  const allowedRoles = ['ADMIN', 'PASTOR', 'LIDER', 'DIACONO'];
  const canCreatePost = user?.systemRole && allowedRoles.includes(user.systemRole);

  // Se não tiver permissão, não renderiza nada
  if (!canCreatePost) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (type !== 'geral' && !targetId && !fixedContext) {
        setError("Selecione um alvo para o post");
        return;
    }

    setLoading(true);
    setError("");

    try {
      // Generate Title
      let generatedTitle = "";
      const authorName = user?.membro?.nome || "Usuário";
      const authorRole = user?.systemRole || "Membro";

      if (type === 'geral') {
          generatedTitle = `Geral - ${authorName} - ${authorRole}`;
      } else {
          let context = contextName;
          
          if (!fixedContext) {
              if (type === 'area') {
                  context = areas.find(a => a.id === targetId)?.name;
              } else if (type === 'ministerio') {
                  context = ministerios.find(m => m.id === targetId)?.name;
              }
          }

          context = context || (type === 'area' ? 'Área' : 'Ministério');
          generatedTitle = `${context} - ${authorName} - ${authorRole}`;
      }

      const payload = {
        title: generatedTitle,
        content,
        areaId: type === 'area' ? targetId : undefined,
        ministerioId: type === 'ministerio' ? targetId : undefined
      };

      await api.post("/posts", payload);
      
      // Limpar formulário e fechar modal
      setContent("");
      if (!fixedContext) {
        setType("geral");
        setTargetId("");
      }
      setIsOpen(false);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError("Erro ao criar post. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#161616] border border-white/5 rounded-xl p-4 mb-6 flex items-center gap-3 text-gray-400 hover:bg-[#202020] hover:text-white transition-all group"
      >
        <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center group-hover:bg-[#ff3b3f] transition-colors">
            <FaPlus className="text-sm" />
        </div>
        <span className="font-medium">Criar novo post...</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-white/10 rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            
            <h3 className="text-white font-bold mb-6 text-xl">Criar Novo Post</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Conteúdo */}
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="O que você quer compartilhar?"
                  className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors min-h-[150px] resize-y"
                  required
                  autoFocus
                />
              </div>

              {/* Seleção de Contexto (se não for fixo) */}
              {!fixedContext && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 ml-1">Destino</label>
                    <select
                      value={type}
                      onChange={(e) => {
                          setType(e.target.value as any);
                          setTargetId(""); // Reset target when type changes
                      }}
                      className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="geral">Geral (Para todos)</option>
                      <option value="area">Área Específica</option>
                      <option value="ministerio">Ministério Específico</option>
                    </select>
                  </div>

                  {type === "area" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 ml-1">Selecionar Área</label>
                      <select
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                        required
                      >
                        <option value="">Selecione...</option>
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                        {areas.length === 0 && <option value="" disabled>Nenhuma área vinculada</option>}
                      </select>
                    </div>
                  )}

                  {type === "ministerio" && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 ml-1">Selecionar Ministério</label>
                      <select
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full bg-[#252525] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 transition-colors"
                        required
                      >
                        <option value="">Selecione...</option>
                        {ministerios.map(min => (
                          <option key={min.id} value={min.id}>{min.name}</option>
                        ))}
                        {ministerios.length === 0 && <option value="" disabled>Nenhum ministério vinculado</option>}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black font-bold py-2 px-8 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
