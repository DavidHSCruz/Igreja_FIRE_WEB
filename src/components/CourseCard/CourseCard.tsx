import React from 'react';

export type CourseStatus = 'concluido' | 'em_andamento' | 'nao_iniciado';

interface CourseCardProps {
  title: string;
  subtitle: string;
  status: CourseStatus;
  borderClass?: string;
}

export const CourseCard = ({ title, subtitle, status, borderClass }: CourseCardProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'concluido':
        return {
          badge: 'bg-green-500/20 text-green-500',
          text: 'Concluído',
          defaultBorder: 'border-secondary',
          opacity: 'opacity-100'
        };
      case 'em_andamento':
        return {
          badge: 'bg-yellow-500/20 text-yellow-500',
          text: 'Em andamento',
          defaultBorder: 'border-secondary',
          opacity: 'opacity-100'
        };
      case 'nao_iniciado':
        return {
          badge: 'bg-gray-700 text-gray-400',
          text: 'Não iniciado',
          defaultBorder: 'border-blue-500',
          opacity: 'opacity-75'
        };
      default:
        return {
          badge: 'bg-gray-700 text-gray-400',
          text: 'Desconhecido',
          defaultBorder: 'border-gray-500',
          opacity: 'opacity-100'
        };
    }
  };

  const styles = getStatusStyles();
  const finalBorderClass = borderClass || styles.defaultBorder;

  return (
    <div className={`bg-[#252525] p-4 rounded-lg border-l-4 ${finalBorderClass} flex justify-between items-center ${styles.opacity}`}>
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${styles.badge}`}>
        {styles.text}
      </span>
    </div>
  );
};
