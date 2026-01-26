import { FaClock, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { CardMembro } from '../CardMembro/CardMembro';
import { useAuth } from '../../contexts/AuthContext';

export interface ScaleItem {
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

export interface ScaleGroup {
  id: string;
  evento: string;
  eventoId?: string;
  data: string;
  local?: string;
  items: ScaleItem[];
  originalItems?: any[];
}

interface ScaleCardProps {
  scale: ScaleGroup;
  className?: string;
  onJoin?: (scaleId: string) => void;
  onConfirm?: (scaleId: string, membroId: string) => void;
  onEdit?: (scale: ScaleGroup) => void;
}

const DEFAULT_COLOR = '#eeaa10'

export const ScaleCard = ({ scale, className = '', onJoin, onConfirm, onEdit }: ScaleCardProps) => {
  const { user } = useAuth();
  const data = new Date(scale.data)
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit' });
  const horas = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const local = scale.local;
  const tituloEv = scale.evento.split(' - ');

  const allowedRoles = ['ADMIN', 'PASTOR', 'LIDER'];
  const canEdit = user?.systemRole && allowedRoles.includes(user.systemRole);
  
  return (
    <div className={`bg-[#111111] rounded-3xl p-6 border border-white/10 shadow-lg ${className} relative group`}>
      {/* TITULO */}
      <div className="flex items-center justify-between">
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-normal text-white">{tituloEv[0]}</h3>
            {canEdit && onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(scale);
                }}
                className="text-gray-500 hover:text-white transition-colors p-1"
                title="Editar escala"
              >
                <FaEdit size={14} />
              </button>
            )}
          </div>
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
          scale.items.map((item, idx) => (
            <CardMembro 
              key={`${item.name}-${idx}`}
              item={item}
              onJoin={onJoin}
              onConfirm={onConfirm}
              defaultColor={DEFAULT_COLOR}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">Nenhum voluntário escalado.</p>
        )}
      </div>
    </div>
  );
};
