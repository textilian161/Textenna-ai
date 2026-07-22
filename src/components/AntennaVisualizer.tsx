import React, { useState } from "react";
import { AntennaDimensions, AntennaTypeId } from "../types";

interface AntennaVisualizerProps {
  type: AntennaTypeId;
  dimensions: AntennaDimensions;
  substrateName: string;
  substrateThickness: number;
  conductiveName: string;
}

export const AntennaVisualizer: React.FC<AntennaVisualizerProps> = ({
  type,
  dimensions,
  substrateName,
  substrateThickness,
  conductiveName,
}) => {
  const [viewMode, setViewMode] = useState<"top" | "stack">("top");

  // Render SVG based on antenna type
  const renderTopView = () => {
    const { width, length, groundWidth, groundLength, feedlineWidth, feedlineLength, gap } = dimensions;

    if (type === "patch") {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full max-h-[280px]" id="svg-patch-top">
          {/* Background / Substrate */}
          <rect x="50" y="30" width="300" height="240" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4 4" />
          <text x="60" y="52" className="text-[10px] font-mono fill-slate-500 font-bold">TEXTILE SUBSTRATE ({substrateName})</text>
          
          {/* Ground Plane (slightly smaller than substrate for visualization) */}
          <rect x="60" y="40" width="280" height="220" rx="4" fill="#94a3b8" fillOpacity="0.25" stroke="#cbd5e1" strokeWidth="1" />
          <text x="330" y="250" textAnchor="end" className="text-[10px] font-mono fill-slate-500 font-bold">GROUND PLANE: {groundWidth} x {groundLength} mm</text>

          {/* Microstrip Patch (Centered) */}
          <rect x="130" y="70" width="140" height="110" rx="2" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />
          
          {/* Microstrip Feedline */}
          <rect x="188" y="180" width="24" height="80" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />

          {/* Dimension Annotations */}
          {/* Width W */}
          <line x1="130" y1="55" x2="270" y2="55" stroke="#d97706" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="200" y="50" textAnchor="middle" className="text-xs font-mono font-bold fill-amber-700">W = {width} mm</text>

          {/* Length L */}
          <line x1="115" y1="70" x2="115" y2="180" stroke="#d97706" strokeWidth="1.5" />
          <text x="105" y="130" textAnchor="middle" transform="rotate(-90 105 130)" className="text-xs font-mono font-bold fill-amber-700">L = {length} mm</text>

          {/* Feedline Width */}
          <line x1="188" y1="230" x2="212" y2="230" stroke="#7c3aed" strokeWidth="1" />
          <text x="200" y="245" textAnchor="middle" className="text-[9px] font-mono fill-purple-700 font-bold">W_f = {feedlineWidth} mm</text>

          {/* Legend */}
          <rect x="220" y="195" width="120" height="50" rx="6" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="232" cy="210" r="5" fill="#fbbf24" />
          <text x="244" y="213" className="text-[9px] font-bold fill-slate-700">Radiator ({conductiveName})</text>
          <circle cx="232" cy="228" r="5" fill="#94a3b8" />
          <text x="244" y="231" className="text-[9px] font-bold fill-slate-700">Ground Conductor</text>

          {/* SVG Arrow Marker definitions */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>
        </svg>
      );
    }

    if (type === "cpw_monopole") {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full max-h-[280px]" id="svg-cpw-top">
          {/* Substrate */}
          <rect x="50" y="30" width="300" height="240" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
          <text x="60" y="52" className="text-[10px] font-mono fill-slate-500 font-bold">TEXTILE SUBSTRATE ({substrateName})</text>

          {/* Monopole Radiator (centered, top half) */}
          <rect x="140" y="60" width="120" height="110" rx="2" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />
          {/* Central Feedline */}
          <rect x="185" y="170" width="30" height="90" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />

          {/* Coplanar Ground planes (on left and right of feedline) */}
          <rect x="60" y="180" width="115" height="80" rx="2" fill="#fbbf24" fillOpacity="0.65" stroke="#d97706" strokeWidth="1.5" />
          <rect x="225" y="180" width="115" height="80" rx="2" fill="#fbbf24" fillOpacity="0.65" stroke="#d97706" strokeWidth="1.5" />

          {/* Dimensions */}
          {/* Monopole Width */}
          <line x1="140" y1="45" x2="260" y2="45" stroke="#d97706" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="200" y="40" textAnchor="middle" className="text-xs font-mono font-bold fill-amber-700">W = {width} mm</text>

          {/* Monopole Length L */}
          <line x1="125" y1="60" x2="125" y2="170" stroke="#d97706" strokeWidth="1.5" />
          <text x="115" y="115" textAnchor="middle" transform="rotate(-90 115 115)" className="text-xs font-mono font-bold fill-amber-700">L = {length} mm</text>

          {/* Coplanar Gap */}
          <line x1="175" y1="210" x2="185" y2="210" stroke="#ef4444" strokeWidth="1.2" />
          <text x="180" y="202" textAnchor="middle" className="text-[9px] font-mono fill-red-600 font-bold">gap = {gap} mm</text>

          {/* Legend */}
          <rect x="240" y="220" width="100" height="30" rx="6" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
          <text x="245" y="238" className="text-[8px] font-bold fill-red-600 font-mono">CPW COPLANAR LAYER</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>
        </svg>
      );
    }

    if (type === "pifa") {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full max-h-[280px]" id="svg-pifa-top">
          {/* Substrate */}
          <rect x="50" y="30" width="300" height="240" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
          <text x="60" y="52" className="text-[10px] font-mono fill-slate-500 font-bold">TEXTILE SUBSTRATE ({substrateName})</text>
          
          {/* Ground Plane */}
          <rect x="60" y="40" width="280" height="220" rx="4" fill="#94a3b8" fillOpacity="0.2" stroke="#cbd5e1" strokeWidth="1" />

          {/* PIFA Patch (offset / top-left) */}
          <rect x="80" y="60" width="130" height="100" rx="2" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />

          {/* Shorting Wall (at left edge of the patch) */}
          <rect x="80" y="60" width="6" height="100" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <text x="92" y="115" className="text-[9px] font-mono fill-white font-bold" transform="rotate(-90 92 115)">SHORTING WALL</text>

          {/* Feed Pin (as a small circle with feed dot) */}
          <circle cx="115" cy="90" r="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
          <text x="125" y="93" className="text-[9px] font-mono fill-blue-700 font-bold">FEED PIN (50 Ω)</text>

          {/* Annotations */}
          <line x1="80" y1="48" x2="210" y2="48" stroke="#d97706" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="145" y="43" textAnchor="middle" className="text-xs font-mono font-bold fill-amber-700">W = {width} mm</text>

          <line x1="68" y1="60" x2="68" y2="160" stroke="#d97706" strokeWidth="1.5" />
          <text x="58" y="110" textAnchor="middle" transform="rotate(-90 58 110)" className="text-xs font-mono font-bold fill-amber-700">L = {length} mm</text>

          {/* Legend */}
          <rect x="225" y="175" width="115" height="65" rx="6" fill="#f8fafc" fillOpacity="0.95" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="237" cy="190" r="5" fill="#ef4444" />
          <text x="247" y="193" className="text-[8px] font-bold fill-slate-700">Shorting Wall</text>
          <circle cx="237" cy="207" r="5" fill="#3b82f6" />
          <text x="247" y="210" className="text-[8px] font-bold fill-slate-700">Feed Point</text>
          <circle cx="237" cy="224" r="5" fill="#fbbf24" />
          <text x="247" y="227" className="text-[8px] font-bold fill-slate-700">Radiating Patch</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>
        </svg>
      );
    }

    if (type === "dipole") {
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full max-h-[280px]" id="svg-dipole-top">
          {/* Substrate */}
          <rect x="50" y="30" width="300" height="240" rx="8" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
          <text x="60" y="52" className="text-[10px] font-mono fill-slate-500 font-bold">TEXTILE SUBSTRATE ({substrateName})</text>

          {/* Symmetrical Dipole Arms */}
          <rect x="70" y="135" width="126" height="30" rx="1" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />
          <rect x="204" y="135" width="126" height="30" rx="1" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />

          {/* Central Feed Point */}
          <circle cx="196" cy="150" r="3" fill="#3b82f6" />
          <circle cx="204" cy="150" r="3" fill="#3b82f6" />
          <path d="M 196 150 Q 200 170 200 190" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M 204 150 Q 200 170 200 190" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="200" y="205" textAnchor="middle" className="text-[9px] font-mono fill-blue-700 font-bold">50 Ω Balanced Feed</text>

          {/* Annotations */}
          {/* Single Arm Length */}
          <line x1="70" y1="120" x2="196" y2="120" stroke="#d97706" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="133" y="115" textAnchor="middle" className="text-xs font-mono font-bold fill-amber-700">Arm L = {length} mm</text>

          {/* Total Dipole Length */}
          <line x1="70" y1="90" x2="330" y2="90" stroke="#059669" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text x="200" y="85" textAnchor="middle" className="text-xs font-mono font-bold fill-emerald-700">Total Length ≈ {(length * 2 + 1.0).toFixed(1)} mm</text>

          {/* Arm Width */}
          <line x1="55" y1="135" x2="55" y2="165" stroke="#d97706" strokeWidth="1.2" />
          <text x="45" y="153" textAnchor="middle" transform="rotate(-90 45 153)" className="text-[10px] font-mono font-bold fill-amber-700">Arm W = {width} mm</text>

          {/* Gap */}
          <text x="200" y="130" textAnchor="middle" className="text-[8px] font-mono fill-blue-700 font-bold">Feed Gap: 1.0 mm</text>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
            </marker>
          </defs>
        </svg>
      );
    }

    return null;
  };

  // Render 3D layer stack-up schematic
  const renderStackView = () => {
    return (
      <svg viewBox="0 0 400 240" className="w-full h-full max-h-[280px]" id="svg-stack">
        {/* Top layer (Patch / Radiator) */}
        <path d="M 80 50 L 320 50 L 280 80 L 40 80 Z" fill="#fbbf24" fillOpacity="0.95" stroke="#d97706" strokeWidth="1.5" />
        <text x="330" y="65" className="text-xs font-bold fill-amber-700">TOP LAYER (Radiator): {conductiveName}</text>

        {/* Dielectric Substrate Layer */}
        <path d="M 40 80 L 280 80 L 280 140 L 40 140 Z" fill="#bae6fd" fillOpacity="0.8" />
        <path d="M 280 80 L 320 50 L 320 110 L 280 140 Z" fill="#7dd3fc" fillOpacity="0.9" />
        <path d="M 40 80 L 320 50 L 320 110 L 280 140 L 40 140 L 40 80 Z" fill="none" stroke="#0284c7" strokeWidth="1.5" />
        {/* Draw internal texture representing cloth threads */}
        <line x1="80" y1="90" x2="140" y2="120" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="160" y1="75" x2="220" y2="105" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
        
        <text x="140" y="115" textAnchor="middle" className="text-sm font-extrabold fill-slate-800">{substrateName} Substrate ({substrateThickness} mm)</text>
        <text x="330" y="115" className="text-xs font-bold fill-slate-600">h = {substrateThickness} mm (Eps_r = {dimensions.effectiveEpsilon || "Variable"})</text>

        {/* Bottom layer (Ground plane) - only shown if it uses a bottom ground */}
        {type === "patch" || type === "pifa" ? (
          <>
            <path d="M 40 140 L 280 140 L 320 110 L 80 110 Z" fill="#94a3b8" fillOpacity="0.8" stroke="#475569" strokeWidth="1.5" />
            <text x="330" y="145" className="text-xs font-bold fill-slate-600">BOTTOM LAYER: Solid Ground Plane ({conductiveName})</text>
            <text x="45" y="170" className="text-[10px] fill-emerald-600 font-semibold font-mono">✦ Solid ground shields human body tissues from RF radiation (Low SAR)</text>
          </>
        ) : (
          <>
            <path d="M 40 140 L 280 140 L 320 110 L 80 110 Z" fill="#bae6fd" fillOpacity="0.1" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
            <text x="330" y="145" className="text-xs font-bold fill-red-600 font-mono">✦ NO BACK GROUND PLANE (Single-sided)</text>
            <text x="45" y="170" className="text-[10px] fill-red-600 font-semibold font-mono">⚠️ No shielding: Sensitive to body contact and tissue absorption (High SAR)</text>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 overflow-hidden" id="card-antenna-visualizer">
      {/* Header */}
      <div className="bg-sky-50/40 px-4 py-3 border-b border-sky-100/80 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Antenna Physical Layout Model</h3>
          <p className="text-[11px] text-slate-400">Mathematical calculation based on Transmission Line model</p>
        </div>
        <div className="flex bg-slate-100/80 p-1 border border-slate-200/60 rounded-xl text-xs">
          <button
            onClick={() => setViewMode("top")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === "top" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
            id="btn-view-top"
          >
            Top View (2D)
          </button>
          <button
            onClick={() => setViewMode("stack")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === "stack" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
            }`}
            id="btn-view-stack"
          >
            Layer Stackup
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="p-4 flex flex-col justify-center items-center bg-sky-50/20 min-h-[300px]">
        {viewMode === "top" ? renderTopView() : renderStackView()}
      </div>

      {/* Numerical Specs Table */}
      <div className="bg-sky-50/40 border-t border-sky-100/80 px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Radiator Width (W)</span>
          <span className="text-blue-600 font-bold text-sm">{dimensions.width} mm</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Radiator Length (L)</span>
          <span className="text-blue-600 font-bold text-sm">{dimensions.length} mm</span>
        </div>
        {dimensions.effectiveEpsilon !== undefined && (
          <div>
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Effective Permittivity</span>
            <span className="text-emerald-600 font-bold text-sm">{dimensions.effectiveEpsilon}</span>
          </div>
        )}
        {dimensions.deltaL !== undefined && (
          <div>
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Fringing Extension (ΔL)</span>
            <span className="text-purple-600 font-bold text-sm">{dimensions.deltaL} mm</span>
          </div>
        )}
        {type !== "dipole" && (
          <>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Ground Width (Wg)</span>
              <span className="text-slate-700 font-bold text-sm">{dimensions.groundWidth} mm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Ground Length (Lg)</span>
              <span className="text-slate-700 font-bold text-sm">{dimensions.groundLength} mm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Feed Width (Wf)</span>
              <span className="text-slate-700 font-bold text-sm">{dimensions.feedlineWidth} mm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-sans font-semibold">Feed Length (Lf)</span>
              <span className="text-slate-700 font-bold text-sm">{dimensions.feedlineLength} mm</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
