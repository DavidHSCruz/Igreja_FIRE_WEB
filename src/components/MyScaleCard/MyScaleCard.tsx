import React from 'react';
import { Link } from 'react-router-dom';

export interface MyScaleCardProps {
  name: string;
  icon: React.ReactNode;
  link?: string;
  details?: string;
  className?: string;
  color?: string;
  status?: 'PENDENTE' | 'CONFIRMADO' | 'DISPONIVEL' | 'RECUSADO';
}

export const MyScaleCard: React.FC<MyScaleCardProps> = ({ 
  name, 
  icon, 
  link, 
  details, 
  className = '',
  color,
  status
}) => {
  const statusColorMap: Record<string, string> = {
    PENDENTE: '#ef4444',
    CONFIRMADO: '#22c55e',
    DISPONIVEL: '#3b82f6',
    RECUSADO: '#6b7280'
  };

  const effectiveColor = status
    ? statusColorMap[status] || color || '#eeaa10'
    : color || '#eeaa10';

  const content = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white text-zinc-800 flex items-center justify-center shrink-0 text-lg">
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="font-bold text-white text-sm">
          {name}
        </span>
        {details && (
          <span className="text-xs text-zinc-400 font-normal mt-0.5">
            {details}
          </span>
        )}
      </div>
    </div>
  );

  const baseClasses = `w-full bg-[#252525] p-4 rounded-lg border-l-4 ${className}`;
  const style = { borderColor: effectiveColor };

  if (link) {
    return (
      <Link
        to={link}
        className={`${baseClasses} hover:bg-[#303030] transition-all group block`}
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} cursor-default`} style={style}>
      {content}
    </div>
  );
};
