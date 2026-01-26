import React from 'react';
import { FaRegClock } from 'react-icons/fa';

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({ date, className = "text-[10px] text-gray-500" }) => {
  const formatDate = (dateValue: string | Date): string => {
    const now = new Date();
    const past = new Date(dateValue);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    // Menos de 1 minuto
    if (diffInSeconds < 60) {
      return 'agora';
    }

    const minutes = Math.floor(diffInSeconds / 60);
    // Menos de 1 hora (mostre minuto a minuto)
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }

    const hours = Math.floor(minutes / 60);
    // Menos de 24 horas (mostre de hora em hora)
    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }

    const days = Math.floor(hours / 24);
    // Menos de 1 semana (mostre de dia em dia)
    if (days < 7) {
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    }

    const weeks = Math.floor(days / 7);
    // Menos de 1 mês (considerando ~30 dias) (mostre de semana a semana)
    if (days < 30) {
      return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
    }

    // A partir de 1 mês mostre a data
    return past.toLocaleDateString('pt-BR');
  };

  return (
    <p className={`flex items-center gap-1 ${className}`}>
      <FaRegClock className="text-[10px]" /> {formatDate(date)}
    </p>
  );
};
