import { FaCheck, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { UserAvatar } from '../UserAvatar/UserAvatar';

export interface ScaleItem {
  name: string;
  roles: string;
  scaleId?: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';
  isCurrentUser?: boolean;
  membroId?: string;
  color?: string;
  avatarUrl?: string;
}

export interface ScaleGroup {
  id: string;
  evento: string;
  data: string;
  local?: string;
  items: ScaleItem[];
}

interface ScaleCardProps {
  scale: ScaleGroup;
  className?: string;
  onJoin?: (scaleId: string) => void;
  onConfirm?: (scaleId: string, membroId: string) => void;
}

const DEFAULT_COLOR = '#eeaa10'

export const ScaleCard = ({ scale, className = '', onJoin, onConfirm }: ScaleCardProps) => {
  const data = new Date(scale.data)
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
  const horas = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const local = scale.local;
  const tituloEv = scale.evento.split(' - ');

  return (
    <div className={`bg-[#111111] rounded-3xl p-6 border border-white/10 shadow-lg ${className}`}>
      {/* TITULO */}
      <div className="flex items-center justify-between">
        <div className="mb-2">
          <h3 className="text-2xl font-normal text-white">{tituloEv[0]}</h3>
          <p className="font-normal text-gray-500">{tituloEv[1]}</p>
        </div>

        <div className='flex items-start gap-3'>
          <div className="flex flex-col items-end gap-1 text-xs text-gray-500 py-1">
            <span className="flex items-center gap-1">{horas} <FaClock /></span>
            {local && <span className="flex items-center gap-1">{local} <FaMapMarkerAlt /></span>}
          </div>

          <div className="bg-[#252525] w-14 h-14 rounded-lg flex flex-col items-center justify-center border border-white/5 shrink-0">
              <span className="text-[10px] uppercase text-gray-400 font-bold">{mes}</span>
              <span className="text-xl font-bold text-white">{dia}</span>
          </div>
        </div>
      </div>

      <div className="w-3/4 h-px bg-gray-700 mb-4" />

      {/* DETALHES */}
      <div className="space-y-3">

        {scale.items.length > 0 ? (
          scale.items.map((item, idx) => {
            const isAvailable = item.name === 'Disponível';
            const itemColor = !isAvailable ? (item.color || DEFAULT_COLOR) : DEFAULT_COLOR; // Use default color if no color provided

            // Styles for custom colors
            const containerStyle = !isAvailable ? { borderColor: itemColor } : {};
            const textStyle = !isAvailable ? { color: itemColor } : {};
            const badgeStyle = !isAvailable ? { 
                backgroundColor: `${itemColor}33`, // Adding opacity to hex
                color: itemColor 
            } : {};

            // Classes for fallback or static colors
            const borderClass = isAvailable ? 'border-zinc-400' : '';
            const textClass = isAvailable ? 'text-zinc-400' : '';

            // Badge classes - if custom, we clear these and use style
            const badgeBgClass = isAvailable ? 'bg-zinc-400/20' : '';
            const badgeTextClass = isAvailable ? 'text-zinc-400' : '';

            return (
              <div 
                key={`${item.name}-${idx}`}
                className={`
                  flex-1 bg-[#252525] p-4 rounded-lg border-l-4 
                  ${borderClass} 
                  ${isAvailable && onJoin ? 'cursor-pointer hover:opacity-90 transition-opacity bg-zinc-700' : ''}
                  ${item.isCurrentUser ? 'border-2' : ''}
                `}
                style={containerStyle}
                onClick={() => {
                    if (isAvailable && onJoin && item.scaleId) {
                        onJoin(item.scaleId);
                    }
                }}
              >
                  <div className='flex justify-between'>
                    <div className='flex gap-2 items-center'>
                      <div className="w-10 h-10">
                        {isAvailable ? (
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-600 text-lg">
                            <FaCheck className="text-zinc-700" />
                          </div>
                        ) : (
                          <UserAvatar 
                            user={{ avatarUrl: item.avatarUrl, membro: { nome: item.name } }}
                            size="w-10 h-10"
                            iconSize="text-lg"
                            hasBorder={false}
                          />
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <div className="flex justify-between items-start">
                          <span 
                            className={`font-bold ${item.name === 'Disponível' ? 'text-white' : textClass}`}
                            style={item.name !== 'Disponível' ? textStyle : {}}
                          >
                            {item.name} 
                            {item.isCurrentUser && <span className="ml-2 opacity-75">- Você</span>}
                          </span>
                        </div>
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
                              {item.status}
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
                    <span 
                        className={`${badgeBgClass} ${badgeTextClass} text-[10px] h-max font-bold px-2 py-0.5 rounded uppercase`}
                        style={badgeStyle}
                    >
                      {item.roles}
                    </span>
                  </div>

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
