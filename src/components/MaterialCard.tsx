import React from "react";
import { Substrate, ConductiveMaterial } from "../types";
import { Info, Cpu, Layers, CheckCircle } from "lucide-react";

interface MaterialCardProps {
  substrates: Substrate[];
  conductiveMaterials: ConductiveMaterial[];
  selectedSubstrateId: string;
  selectedConductiveId: string;
  onSelectSubstrate: (id: string) => void;
  onSelectConductive: (id: string) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  substrates,
  conductiveMaterials,
  selectedSubstrateId,
  selectedConductiveId,
  onSelectSubstrate,
  onSelectConductive,
}) => {
  const currentSubstrate = substrates.find((s) => s.id === selectedSubstrateId) || substrates[0];
  const currentConductive = conductiveMaterials.find((c) => c.id === selectedConductiveId) || conductiveMaterials[0];

  return (
    <div className="space-y-6" id="materials-manager">
      {/* Introduction */}
      <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100/60 shadow-xs">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Textile RF Physics Guide
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Unlike traditional FR4 or Rogers PCB boards, wearable textile substrates are porous and highly flexible. A <strong className="text-blue-700 font-bold">low dielectric constant (εr close to 1)</strong> increases bandwidth and efficiency, while a <strong className="text-red-600 font-bold">high loss tangent (tan δ)</strong> dissipates energy as heat, degrading gain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Substrate Selection List */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 p-5" id="substrate-selection-panel">
          <div className="flex items-center gap-2 mb-4 border-b border-sky-100/40 pb-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Select Textile Substrate (Dielectric)</h3>
          </div>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {substrates.map((sub) => {
              const isSelected = sub.id === selectedSubstrateId;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubstrate(sub.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/60 text-slate-800 ring-2 ring-blue-500/10"
                      : "border-slate-200/80 bg-slate-50/40 hover:border-blue-200 hover:bg-blue-50/20 text-slate-500"
                  }`}
                  id={`btn-sub-${sub.id}`}
                >
                  <div className="flex justify-between items-center w-full font-bold">
                    <span className="text-slate-800 text-xs flex items-center gap-2 font-bold">
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                      {sub.name}
                    </span>
                    <span className="text-blue-700 font-mono bg-blue-100 border border-blue-200/55 px-2 py-0.5 rounded text-[10px]">
                      εr = {sub.epsilonR}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {sub.description}
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Loss Tangent: <strong className="text-slate-700 font-semibold">{sub.tanDelta}</strong></span>
                    <span>Std Thickness: <strong className="text-slate-700 font-semibold">{sub.thickness} mm</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conductive Materials Selection List */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 p-5" id="conductive-selection-panel">
          <div className="flex items-center gap-2 mb-4 border-b border-sky-100/40 pb-3">
            <Cpu className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-800 text-sm">Select Conductive Fabric (Radiator & Ground)</h3>
          </div>
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {conductiveMaterials.map((cond) => {
              const isSelected = cond.id === selectedConductiveId;
              return (
                <button
                  key={cond.id}
                  onClick={() => onSelectConductive(cond.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/40 text-slate-800 ring-2 ring-amber-500/10"
                      : "border-slate-200/80 bg-slate-50/40 hover:border-amber-200 hover:bg-amber-50/20 text-slate-500"
                  }`}
                  id={`btn-cond-${cond.id}`}
                >
                  <div className="flex justify-between items-center w-full font-bold">
                    <span className="text-slate-800 text-xs flex items-center gap-2 font-bold">
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-500" />}
                      {cond.name}
                    </span>
                    <span className="text-amber-700 font-mono bg-amber-100 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                      {cond.conductivity.toExponential(1)} S/m
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {cond.description}
                  </p>
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Sheet Res: <strong className="text-slate-700 font-semibold">{cond.sheetResistance} Ω/sq</strong></span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Physics Impact Dashboard */}
      <div className="bg-white border border-sky-100/80 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5 shadow-xs" id="physics-impact-panel">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">1. Sizing Effect</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            With dielectric constant <strong className="text-slate-800 font-bold">εr = {currentSubstrate.epsilonR}</strong>, your physical patch size is reduced by a factor of <strong className="text-blue-600 font-bold">{(1 / Math.sqrt((currentSubstrate.epsilonR + 1) / 2)).toFixed(2)}x</strong> compared to air. Higher permittivity compresses the wavelength, saving space but reducing radiated bandwidth.
          </p>
        </div>
        <div className="space-y-1.5 border-t md:border-t-0 md:border-x border-slate-200/60 pt-4 md:pt-0 md:px-5">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">2. Radiation Efficiency</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Substrate loss tangent is <strong className="text-slate-800 font-bold">tan δ = {currentSubstrate.tanDelta}</strong>. Highly porous materials like <em>Fleece</em> or <em>Felt</em> have low dielectric losses, yielding over <strong className="text-emerald-600 font-bold">85% radiation efficiency</strong>. Cotton fabrics suffer due to water absorption, dropping efficiency to <strong className="text-red-600 font-bold">under 50%</strong> when sweaty.
          </p>
        </div>
        <div className="space-y-1.5 border-t md:border-t-0 pt-4 md:pt-0">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">3. Conductor Ohmic Loss</span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Your conductor electrical conductivity is <strong className="text-slate-800 font-bold">{currentConductive.conductivity.toExponential(1)} S/m</strong>. Materials like <em>Shieldit Fabric</em> are plated with nickel and copper, ensuring low skin-effect loss ($R_s$) at gigahertz frequencies. This prevents heating and maximizes gain.
          </p>
        </div>
      </div>
    </div>
  );
};
