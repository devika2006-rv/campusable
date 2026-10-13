import React from 'react';
import { Compass } from 'lucide-react';

interface Props {
  onResetHeading?: () => void;
}

export const CompassRose: React.FC<Props> = ({ onResetHeading }) => {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200">
      <button
        onClick={onResetHeading}
        title="Reset Orientation to North"
        className="flex flex-col items-center group focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg p-1"
        aria-label="Reset Camera to North Facing"
      >
        <div className="text-[11px] font-bold text-red-600 tracking-wider">N</div>
        <Compass className="w-6 h-6 text-slate-700 group-hover:text-purple-700 transition-transform group-hover:rotate-12" />
        <div className="text-[10px] font-bold text-slate-400">S</div>
      </button>
      <span className="text-[9px] font-medium text-slate-500 mt-0.5">North Up</span>
    </div>
  );
};
