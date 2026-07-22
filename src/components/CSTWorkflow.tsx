import React, { useState } from "react";
import { AntennaTypeId, AntennaDimensions } from "../types";
import { generateCSTMacro } from "../utils/antennaMath";
import { Copy, Check, Terminal, Play, Shield, Layers, HelpCircle } from "lucide-react";

interface CSTWorkflowProps {
  type: AntennaTypeId;
  dimensions: AntennaDimensions;
  substrateName: string;
  substrateEpsilon: number;
  substrateThickness: number;
  conductiveName: string;
}

export const CSTWorkflow: React.FC<CSTWorkflowProps> = ({
  type,
  dimensions,
  substrateName,
  substrateEpsilon,
  substrateThickness,
  conductiveName,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // CST VBA Macro code
  const macroCode = generateCSTMacro(
    type,
    dimensions,
    substrateName.toLowerCase().replace(/\s+/g, "_"),
    substrateEpsilon,
    substrateThickness,
    conductiveName.toLowerCase().replace(/\s+/g, "_")
  );

  const handleCopyMacro = () => {
    navigator.clipboard.writeText(macroCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: "1. Global Units & Background",
      icon: <Terminal className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Open CST Studio Suite, create a new <strong className="text-slate-800 font-bold">Microwave & RF / Antennas</strong> template, and select the <strong className="text-slate-800 font-bold">Planar</strong> solver.
          </p>
          <div className="bg-slate-50 text-slate-800 p-3.5 rounded-xl text-xs font-mono border border-slate-200/60 space-y-1">
            <div>Dimensions: mm</div>
            <div>Frequency: GHz (Range: {(dimensions.resonantFreq * 0.7).toFixed(1)} to {(dimensions.resonantFreq * 1.5).toFixed(1)} GHz)</div>
            <div>Time: ns</div>
            <div>Background Material: Normal (Vacuum / Air)</div>
          </div>
          <div className="text-[11px] text-amber-850 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
            <strong>Pro-Tip:</strong> Textile antennas have low dielectric constants. Setting a frequency sweep that is wide enough lets you see the full resonance peak, which might shift slightly in fabrication.
          </div>
        </div>
      ),
    },
    {
      title: "2. Textile Material Definitions",
      icon: <Layers className="w-4 h-4" />,
      content: (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Create two custom materials in your CST database before modeling the bricks. Do not use default PEC for fabric layers!
          </p>
          
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="bg-sky-50/40 px-3 py-2 text-xs font-bold text-slate-700 border-b border-slate-100">
              Material 1: Substrate - {substrateName}
            </div>
            <div className="p-3.5 text-[11px] space-y-1.5 text-slate-600">
              <div>• <strong>Type:</strong> Lossy Dielectric</div>
              <div>• <strong>Epsilon (εr):</strong> {substrateEpsilon}</div>
              <div>• <strong>Loss Tangent (tan δ):</strong> {dimensions.effectiveEpsilon ? (substrateEpsilon * 0.01).toFixed(3) : 0.01}</div>
              <div>• <strong>Thermal/Mech:</strong> Flexible / Cotton-like (For advanced thermal coupling)</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="bg-sky-50/40 px-3 py-2 text-xs font-bold text-slate-700 border-b border-slate-100">
              Material 2: Conductor - {conductiveName}
            </div>
            <div className="p-3.5 text-[11px] space-y-1.5 text-slate-600">
              <div>• <strong>Type:</strong> Lossy Metal (or PEC for fast initial sweeps)</div>
              <div>• <strong>Conductivity (σ):</strong> {conductiveName.includes("Copper") ? "5.8e7" : "2.5e5"} S/m</div>
              <div>• <strong>Layer Thickness:</strong> 0.05 mm (Typical for iron-on sheets)</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "3. Waveguide Port Excitation",
      icon: <Play className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Proper port sizing prevents higher-order modes from distorting your impedance matching calculation.
          </p>

          {type === "patch" ? (
            <div className="bg-sky-50/25 border border-sky-100/60 rounded-xl p-3.5 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800">Patch Waveguide Port Formula:</h4>
              <p className="text-slate-500 text-[11px]">Place the port on the substrate face at the feed line edge. Size as follows:</p>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-slate-600">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">Port Width (W_port):<br/><span className="font-bold text-blue-600">≈ 10 * H_sub</span> ({(substrateThickness * 10).toFixed(1)} mm)</div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">Port Height (H_port):<br/><span className="font-bold text-blue-600">≈ 5 * H_sub</span> ({(substrateThickness * 5).toFixed(1)} mm)</div>
              </div>
              <p className="text-[10px] text-slate-400 italic leading-normal">
                Center the port horizontally on the feedline. Set boundaries to: Xmin=-5*W_f, Xmax=5*W_f, Zmin=0 (ground plane), Zmax=5*H_sub.
              </p>
            </div>
          ) : type === "cpw_monopole" ? (
            <div className="bg-sky-50/25 border border-sky-100/60 rounded-xl p-3.5 space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-800">CPW Discrete Port Setup:</h4>
              <p className="text-slate-500 text-[11px]">Because the ground is coplanar on the same layer, use a <strong>Discrete Port</strong>:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-600 text-[11px]">
                <li>Create a port between the central feed patch and the left ground plane.</li>
                <li>Alternatively, use a multipin waveguide port bridging the gaps: Width ≈ W_f + 2 * gap + 4 * H_sub.</li>
                <li>Set Impedance to 50 Ω.</li>
              </ul>
            </div>
          ) : (
            <div className="bg-sky-50/25 border border-sky-100/60 rounded-xl p-3.5 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Discrete Port Setup:</h4>
              <p className="text-slate-500 text-[11px] mb-1">Define a discrete port across the feed gap:</p>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div>• <strong>Port Type:</strong> Discrete Edge / S-Parameter</div>
                <div>• <strong>Impedance:</strong> 50 Ω</div>
                <div>• <strong>Direction:</strong> Parallel to the feed axis</div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "4. Boundary & Solver Settings",
      icon: <Shield className="w-4 h-4" />,
      content: (
        <div className="space-y-3.5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Configure the boundary conditions and solver parameters to get reliable farfield radiation patterns:
          </p>
          <div className="bg-sky-50/10 border border-sky-100/50 rounded-xl p-3.5 space-y-3">
            <div>
              <strong className="text-slate-700 font-semibold block text-[11px]">Boundary Conditions:</strong>
              <div className="text-slate-600 pl-2 mt-0.5 leading-normal">
                Set all directions (X, Y, Z) to <code className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-red-600 font-mono text-[10px]">Open (Add Space)</code>. This models infinite free space around the wearable device.
              </div>
            </div>
            <div>
              <strong className="text-slate-700 font-semibold block text-[11px]">Mesh Type:</strong>
              <div className="text-slate-600 pl-2 mt-0.5 leading-normal">
                Hexahedral mesh (standard for transient solver). Ensure at least 15 to 20 cells per wavelength inside the textile substrate.
              </div>
            </div>
            <div>
              <strong className="text-slate-700 font-semibold block text-[11px]">Farfield Monitors:</strong>
              <div className="text-slate-600 pl-2 mt-0.5 leading-normal">
                Set up dynamic farfield radiation monitors at the center frequency ({dimensions.resonantFreq} GHz) to observe gain (dBi) and efficiency.
              </div>
            </div>
            <div>
              <strong className="text-slate-700 font-semibold block text-[11px]">Solver:</strong>
              <div className="text-slate-600 pl-2 mt-0.5 leading-normal">
                Select the <strong>Time Domain Solver</strong> (Transient Solver) and click <strong>Start</strong> with accuracy of -40 dB.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 overflow-hidden" id="card-cst-assistant">
      {/* Header */}
      <div className="bg-sky-50/40 px-4 py-3 border-b border-sky-100/80">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          CST Studio Suite Simulation Assistant
        </h3>
        <p className="text-[11px] text-slate-400">
          Replicate this physical layout in full-wave 3D electromagnetic simulators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left panel: Steps */}
        <div className="md:col-span-5 border-r border-sky-100/60 bg-sky-50/10 p-3 space-y-1">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center gap-3 text-xs font-medium transition-all cursor-pointer ${
                activeStep === idx
                  ? "bg-blue-50/80 text-blue-700 border-l-4 border-blue-600 shadow-xs"
                  : "text-slate-500 hover:bg-sky-50/30 hover:text-slate-800"
              }`}
              id={`btn-cst-step-${idx}`}
            >
              <span className={`p-1 rounded ${activeStep === idx ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                {step.icon}
              </span>
              {step.title}
            </button>
          ))}
        </div>

        {/* Right panel: Step Detail */}
        <div className="md:col-span-7 p-5 min-h-[250px] flex flex-col justify-between">
          <div className="space-y-3.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {steps[activeStep].title} Setup Instructions
            </h4>
            {steps[activeStep].content}
          </div>

          <div className="mt-5 pt-3 border-t border-sky-100/40 text-[11px] text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
            CST and HFSS models should represent actual dielectric loss tangent of textiles.
          </div>
        </div>
      </div>

      {/* VBA Macro Section */}
      <div className="bg-sky-50/30 border-t border-sky-100/80 px-5 py-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold font-mono">
            <Terminal className="w-3.5 h-3.5" />
            CST VBA Macro Automation Script
          </div>
          <button
            onClick={handleCopyMacro}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all font-sans font-medium cursor-pointer"
            id="btn-copy-macro"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied VBA Macro!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy CST Macro
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
          Copy this script and paste it into CST <strong>(Macros &gt; VBA Macro Editor)</strong>. It will automatically initialize the workspace, configure parameters, and construct the 3D brick geometry for your {type.toUpperCase()} layout.
        </p>
        <div className="relative max-h-36 overflow-y-auto rounded-xl bg-slate-900 p-3.5 text-[10px] font-mono text-sky-200/90 border border-slate-950">
          <pre>{macroCode}</pre>
        </div>
      </div>
    </div>
  );
};
