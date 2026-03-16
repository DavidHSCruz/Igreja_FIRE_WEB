import { useState, useEffect } from "react";
import type { AxiosError } from "axios";
import { FaRegClock, FaCheck } from "react-icons/fa";
import { MyScaleCard } from "../MyScaleCard/MyScaleCard";
import { api } from "../../services/api";
import { useAppSelector } from "../../store/hooks";

const getApiErrorMessage = (error: unknown): string | null => {
  const axiosError = error as AxiosError<unknown>;
  const data = axiosError.response?.data;
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return null;
};

export interface Escala {
  id: string;
  data: string;
  evento: string;
  atividade: {
    name: string;
  };
  local: string;
  status?: "PENDENTE" | "CONFIRMADO" | "RECUSADO";
}

interface AvailableScale {
  id: string;
  data: string;
  evento: string;
  atividade: {
    id: string;
    name: string;
  };
}

interface MyScalesProps {
  scales: Escala[];
  onUpdate?: () => void;
}

export const MyScales = ({
  scales: initialScales,
  onUpdate,
}: MyScalesProps) => {
  const [scales, setScales] = useState<Escala[]>(initialScales);
  const [availableScales, setAvailableScales] = useState<AvailableScale[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    setScales(initialScales);
    fetchAvailableScales();
  }, [initialScales, user]);

  const fetchAvailableScales = async () => {
    try {
      const response = await api.get("/escalas/available");
      setAvailableScales(response.data);
    } catch (error) {
      console.error("Erro ao buscar escalas disponíveis:", error);
    }
  };

  const handleConfirm = async (escalaId: string) => {
    try {
      if (!user?.membro?.id) return;
      await api.patch(
        `/escalas/${escalaId}/voluntarios/${user.membro.id}/confirm`,
      );

      setScales((prev) =>
        prev.map((s) =>
          s.id === escalaId ? { ...s, status: "CONFIRMADO" } : s,
        ),
      );

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao confirmar escala:", error);
      alert("Erro ao confirmar escala.");
    }
  };

  const handleJoin = async (escalaId: string) => {
    try {
      if (!user?.membro?.id) return;
      await api.post(`/escalas/${escalaId}/voluntarios`, {
        membroId: user.membro.id,
      });

      setAvailableScales((prev) => prev.filter((s) => s.id !== escalaId));

      if (onUpdate) {
        onUpdate();
      }

      await fetchAvailableScales();
    } catch (error: unknown) {
      console.error("Erro ao entrar na escala:", error);
      alert(getApiErrorMessage(error) || "Erro ao entrar na escala.");
    }
  };

  return (
    <div className="bg-[#161616] rounded-xl p-6 border border-white/5">
      <h3 className="text-sm text-gray-300 pb-2 border-b border-white/10 mb-4">
        Minhas Escalas
      </h3>
      <div className="space-y-4">
        {scales.length > 0 ? (
          <div className="space-y-3">
            {scales.map((scale) => (
              <div key={scale.id} className="relative group">
                <MyScaleCard
                  name={scale.evento}
                  details={`${new Date(scale.data).toLocaleDateString("pt-BR")} - ${scale.atividade.name}`}
                  icon={
                    scale.status === "CONFIRMADO" ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      <FaRegClock className="text-sm" />
                    )
                  }
                  status={scale.status}
                />

                {scale.status === "PENDENTE" && (
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      onClick={() => handleConfirm(scale.id)}
                      className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded hover:bg-green-600/30 transition-colors flex items-center gap-1"
                    >
                      <FaCheck size={10} /> Confirmar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Nenhuma escala programada.
          </p>
        )}

        {/* DISPONIVEL */}
        {availableScales.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-xs text-gray-400 mb-3 uppercase tracking-wider">
              Escalas disponíveis
            </h4>
            <div className="space-y-3">
              {availableScales.map((scale) => (
                <div key={scale.id} className="relative group">
                  <MyScaleCard
                    name={scale.evento}
                    details={`${new Date(scale.data).toLocaleDateString("pt-BR")} - ${scale.atividade.name}`}
                    icon={<FaRegClock className="text-sm" />}
                    status="DISPONIVEL"
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      onClick={() => handleJoin(scale.id)}
                      className="text-xs bg-blue-600/20 text-blue-500 px-2 py-1 rounded hover:bg-blue-600/30 transition-colors flex items-center gap-1"
                    >
                      <FaCheck size={10} /> Entrar na Escala
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
