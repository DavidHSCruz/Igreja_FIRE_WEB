import React from 'react';
import { Link } from 'react-router-dom';

interface ActivityItemProps {
  name: string;
  icon?: React.ReactNode;
  link?: string;
  details?: string;
  className?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ 
  name, 
  icon, 
  link, 
  details, 
  className = ''
}) => {

  const content = (
    <div className="flex items-center justify-center gap-3">
      {icon &&
        <div className="w-10 h-10 rounded-full bg-white text-zinc-800 flex items-center justify-center shrink-0 text-lg">
          {icon}
        </div>
      }
      <div className="flex flex-col">
        <span className="font-bold text-white text-sm">
          {name}
        </span>
        {details && (
          <span className="text-xs text-zinc-400 font-normal">
            {details}
          </span>
        )}
      </div>
    </div>
  );

  const baseClasses = `w-full bg-[#252525] px-4 py-2 rounded-lg ${className}`;

  if (link) {
    return (
      <Link
        to={link}
        className={`${baseClasses} hover:bg-[#D63031] transition-all group block`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} cursor-default`}>
      {content}
    </div>
  );
};
