import { useState, useEffect } from 'react';
import { FaRegClock, FaCheck } from "react-icons/fa";
import { ActivityItem } from "../MemberProfileCard/ActivityItem";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export interface Escala {
  id: string;
  data: string;
  evento: string;
  atividade: {
    name: string;
  };
  local: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';
}

interface MyScalesProps {
  scales: Escala[];
  onUpdate?: () => void;
}

export const MyScales = ({ scales: initialScales, onUpdate }: MyScalesProps) => {
  const [scales, setScales] = useState<Escala[]>(initialScales);
  const { user } = useAuth();

  useEffect(() => {
    setScales(initialScales);
  }, [initialScales]);

  const handleConfirm = async (escalaId: string) => {
    try {
        if (!user?.membro?.id) return;
        await api.patch(`/escalas/${escalaId}/voluntarios/${user.membro.id}/confirm`);
        
        setScales(prev => prev.map(s => 
            s.id === escalaId ? { ...s, status: 'CONFIRMADO' } : s
        ));

        if (onUpdate) onUpdate();
    } catch (error) {
        console.error("Erro ao confirmar escala:", error);
        alert("Erro ao confirmar escala.");
    }
  };

  return (
    <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
      <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10 mb-4">Minhas Escalas</h3>
      <div className="space-y-3">
        {scales.length > 0 ? (
          scales.map((scale) => (
            <div key={scale.id} className="relative group">
                <ActivityItem
                  name={scale.evento}
                  details={`${new Date(scale.data).toLocaleDateString('pt-BR')} - ${scale.atividade.name}`}
                  icon={<FaRegClock className="text-sm" />}
                />
                {scale.status === 'PENDENTE' && (
                    <div className="mt-2 flex gap-2 justify-end">
                        <button 
                            onClick={() => handleConfirm(scale.id)}
                            className="text-xs bg-green-600/20 text-green-500 px-2 py-1 rounded hover:bg-green-600/30 transition-colors flex items-center gap-1"
                        >
                            <FaCheck size={10} /> Confirmar
                        </button>
                    </div>
                )}
                 {scale.status === 'CONFIRMADO' && (
                    <div className="absolute top-2 right-2 text-green-500 text-xs" title="Confirmado">
                        <FaCheck size={12} />
                    </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            Nenhuma escala programada.
          </p>
        )}
      </div>
    </div>
  );
};
