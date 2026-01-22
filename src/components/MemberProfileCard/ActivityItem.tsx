import React from 'react';
import { Link } from 'react-router-dom';

interface ActivityItemProps {
  name: string;
  icon: React.ReactNode;
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
    <>
      <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-bold uppercase text-gray-300">
          {name}
        </span>
        {details && (
          <span className="text-[9px] text-gray-500 font-normal normal-case">
            {details}
          </span>
        )}
      </div>
    </>
  );

  const baseClasses = `w-full bg-[#252525] py-3 px-4 rounded-xl flex items-center gap-4 ${className}`;

  if (link) {
    return (
      <Link
        to={link}
        className={`${baseClasses} hover:bg-[#303030] transition-all group`}
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
