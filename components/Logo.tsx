
import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center border-2 border-white/20">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 3.181 2.586 5.767 5.767 5.767 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm0 1.5c2.356 0 4.267 1.911 4.267 4.267s-1.911 4.267-4.267 4.267-4.267-1.911-4.267-4.267 1.911-4.267 4.267-4.267zM12.031 0C5.385 0 0 5.385 0 12.031c0 6.646 5.385 12.031 12.031 12.031 6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zm0 2c5.541 0 10.031 4.49 10.031 10.031s-4.49 10.031-10.031 10.031-10.031-4.49-10.031-10.031S6.49 2 12.031 2z"/>
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      {!iconOnly && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">ALATAS</span>
          <span className="text-[10px] font-black tracking-[0.2em] text-emerald-600 uppercase">WHATSAPP</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
