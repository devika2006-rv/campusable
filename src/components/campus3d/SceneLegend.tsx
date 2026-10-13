import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SceneLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-xs transition-all">
      <div
        className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/80 cursor-pointer select-none border-b border-slate-200"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span>Campus Map & Accessibility Legend</span>
        </div>
        <button
          type="button"
          aria-label={collapsed ? 'Expand legend' : 'Collapse legend'}
          className="text-slate-500 hover:text-slate-800 p-0.5 rounded"
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3.5 space-y-3">
          {/* Pathway types */}
          <div>
            <div className="font-semibold text-slate-700 mb-1.5">Pathways & Routes</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 bg-teal-500 rounded-full inline-block"></span>
                <span className="text-slate-700">Step-free Paved Walkway</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                <span className="text-slate-700">Ramp Entrance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 bg-rose-500 border border-dashed border-rose-600 rounded-full inline-block"></span>
                <span className="text-slate-700">Stair Section (Steps)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1.5 bg-slate-400 rounded-full inline-block"></span>
                <span className="text-slate-700">Main Campus Road</span>
              </div>
            </div>
          </div>

          {/* Building Colors */}
          <div>
            <div className="font-semibold text-slate-700 mb-1.5">Building Blocks</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-700 inline-block"></span>
                <span className="text-slate-700">Administrative Block</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-teal-600 inline-block"></span>
                <span className="text-slate-700">Academic CSE-ECE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
                <span className="text-slate-700">Engineering ME-CE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-600 inline-block"></span>
                <span className="text-slate-700">Central Library / Aud</span>
              </div>
            </div>
          </div>

          {/* Verification Warning */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              All building coordinates are approximate based on NAAC site plan. Audited step-free paths are strictly required before wheelchair use.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
