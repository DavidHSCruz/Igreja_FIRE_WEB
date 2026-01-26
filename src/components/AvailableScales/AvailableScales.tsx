import { useState, useEffect } from 'react';
import { FaCalendarPlus, FaCheck } from "react-icons/fa";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { MyScaleCard } from "../MyScaleCard/MyScaleCard";

interface AvailableScale {
  id: string;
  data: string;
  evento: string;
  atividade: {
    id: string;
    name: string;
  };
}

interface AvailableScalesProps {
  onUpdate?: () => void;
}

export const AvailableScales = ({ onUpdate }: AvailableScalesProps) => {
  const [scales, setScales] = useState<AvailableScale[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableScales();
  }, [user]); // Re-fetch when user changes

  // Expose fetch function to parent via ref or context if needed, 
  // but simpler is to rely on parent passing a refresh trigger or just internal management.
  // Actually, if parent wants to trigger refresh, we might need a dependency.
  // For now, let's keep internal state but allow notifying parent.
  
  const fetchAvailableScales = async () => {
    try {
      const response = await api.get('/escalas/available');
      setScales(response.data);
    } catch (error) {
      console.error("Erro ao buscar escalas disponíveis:", error);
    }
  };

  const handleJoin = async (escalaId: string) => {
    try {
        if (!user?.membro?.id) return;
        setLoading(true);
        await api.post(`/escalas/${escalaId}/voluntarios`, {
            membroId: user.membro.id
        });
        
        // Remove locally immediately for better UX
        setScales(prev => prev.filter(s => s.id !== escalaId));
        
        alert("Você entrou na escala com sucesso!");
        
        // Notify parent to refresh other components (like MyScales)
        if (onUpdate) {
            onUpdate();
        }
        
        // Refresh local list just in case
        fetchAvailableScales();
        
    } catch (error: any) {
        console.error("Erro ao entrar na escala:", error);
        alert(error.response?.data?.message || "Erro ao entrar na escala.");
    } finally {
        setLoading(false);
    }
  };

  if (scales.length === 0) return null;

  return (
    <div className="bg-[#161616] rounded-xl p-6 border border-white/5 mt-6">
      <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10 mb-4">Escalas Disponíveis</h3>
      <div className="space-y-3">
          {scales.map((scale) => (
            <div key={scale.id} className="relative group">
                <MyScaleCard
                  name={scale.evento}
                  details={`${new Date(scale.data).toLocaleDateString('pt-BR')} - ${scale.atividade.name}`}
                  icon={<FaCalendarPlus className="text-sm" />}
                  status="DISPONIVEL"
                />
                <div className="mt-2 flex gap-2 justify-end">
                    <button 
                        onClick={() => handleJoin(scale.id)}
                        disabled={loading}
                        className="text-xs bg-blue-600/20 text-blue-500 px-2 py-1 rounded hover:bg-blue-600/30 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <FaCheck size={10} /> Entrar na Escala
                    </button>
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};
