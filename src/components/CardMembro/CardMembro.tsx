import { FaCheck } from 'react-icons/fa';
import { UserAvatar } from '../UserAvatar/UserAvatar';

interface ScaleItem {
  name: string;
  roles: string;
  scaleId?: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO';
  description?: string;
  isCurrentUser?: boolean;
  membroId?: string;
  color?: string;
  avatarUrl?: string;
}

interface CardMembroProps {
  item: ScaleItem;
  onJoin?: (scaleId: string) => void;
  onConfirm?: (scaleId: string, membroId: string) => void;
  defaultColor?: string;
}

export const CardMembro = ({ 
  item, 
  onJoin, 
  onConfirm, 
  defaultColor = '#EA3539'
}: CardMembroProps) => {
  const isAvailable = item.name === 'Disponível';
  const itemColor = !isAvailable ? (item.color || defaultColor) : defaultColor;

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

              {!isAvailable && item.description && (
                <span className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                    {item.description}
                </span>
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
};
