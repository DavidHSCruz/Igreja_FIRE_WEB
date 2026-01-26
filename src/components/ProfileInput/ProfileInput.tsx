import React, { ReactNode } from "react";

interface ProfileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
}

export const ProfileInput = ({
  label,
  icon,
  error,
  className = "",
  ...props
}: ProfileInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs text-gray-400 font-bold uppercase ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-[#252525] border ${
            error ? "border-red-500" : "border-white/10"
          } rounded-lg py-3 ${icon ? "pl-10" : "pl-4"} pr-4 text-sm text-white focus:outline-none focus:border-secondary transition-colors ${
            props.disabled || props.readOnly ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-red-500 text-xs ml-1">{error}</span>}
    </div>
  );
};
