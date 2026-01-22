import { FaUser, FaCheck } from 'react-icons/fa';

export interface ScaleItem {
  name: string;
  roles: string;
  scaleId?: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';
  isCurrentUser?: boolean;
  membroId?: string;
}

export interface ScaleGroup {
  id: string;
  evento: string;
  data: string;
  items: ScaleItem[];
}

interface ScaleCardProps {
  scale: ScaleGroup;
  className?: string;
  onJoin?: (scaleId: string) => void;
  onConfirm?: (scaleId: string, membroId: string) => void;
}

const PILL_COLORS = [
  'bg-[#D98E04]', // Gold
  'bg-[#2E75D8]', // Blue
  'bg-[#C12688]', // Pink
  'bg-[#D63031]', // Red
  'bg-[#2F855A]', // Green
  'bg-[#553C9A]', // Purple
];

export const ScaleCard = ({ scale, className = '', onJoin, onConfirm }: ScaleCardProps) => {
  return (
    <div
      className={`bg-[#111111] rounded-3xl p-6 border border-white/10 shadow-lg ${className}`}
    >
      <h3 className="text-2xl font-normal text-white mb-2">{scale.evento}</h3>
      <div className="w-full h-px bg-gray-700 mb-4" />
      <p className="text-gray-300 text-lg mb-6 font-light">
        {new Date(scale.data).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })}
      </p>

      <div className="space-y-3">
        {scale.items.length > 0 ? (
          scale.items.map((item, idx) => {
            const isAvailable = item.name === 'Disponível';
            const bgClass = isAvailable ? 'bg-zinc-700' : PILL_COLORS[idx % PILL_COLORS.length];

            return (
              <div
                key={`${item.name}-${idx}`}
                className={`${bgClass} rounded-full py-3 px-5 flex items-center justify-between text-white shadow-md ${isAvailable && onJoin ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                onClick={() => {
                    if (isAvailable && onJoin && item.scaleId) {
                        onJoin(item.scaleId);
                    }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 text-lg">
                    {isAvailable ? <FaCheck className="text-zinc-700" /> : <FaUser />}
                  </div>
                  <div className="flex flex-col">
                      <span className="text-lg font-medium">
                        {item.name} 
                        {item.isCurrentUser && <span className="text-xs ml-2 opacity-75">(Você)</span>}
                      </span>
                      
                      {isAvailable && onJoin && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.scaleId) onJoin(item.scaleId);
                            }}
                            className="mt-1 bg-white text-zinc-900 text-xs font-bold px-3 py-1 rounded shadow-sm hover:bg-gray-200 transition-colors self-start uppercase tracking-wider"
                        >
                            Entrar
                        </button>
                      )}
                      
                      {!isAvailable && item.status && (
                        <span className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                            Status: {item.status}
                        </span>
                      )}

                      {item.isCurrentUser && item.status === 'PENDENTE' && onConfirm && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.scaleId && item.membroId) {
                                    onConfirm(item.scaleId, item.membroId);
                                }
                            }}
                            className="mt-2 bg-white text-green-700 text-xs font-bold px-3 py-1 rounded shadow-sm hover:bg-gray-100 transition-colors self-start uppercase tracking-wider"
                        >
                            Confirmar
                        </button>
                      )}
                  </div>
                </div>
                <span className="text-white/90 font-light text-base">
                  {item.roles}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic">Nenhum voluntário escalado.</p>
        )}
      </div>
    </div>
  );
};
