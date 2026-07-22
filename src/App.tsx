import { useState, useEffect } from "react";
import { SUBSTRATES, CONDUCTIVE_MATERIALS, ANTENNA_TYPES } from "./data/materials";
import { AntennaTypeId } from "./types";
import { calculateAntennaDimensions } from "./utils/antennaMath";
import { AntennaVisualizer } from "./components/AntennaVisualizer";
import { CSTWorkflow } from "./components/CSTWorkflow";
import { MaterialCard } from "./components/MaterialCard";
import { ChatAssistant } from "./components/ChatAssistant";
import {
  Radio,
  Sliders,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  AlertTriangle,
  Flame,
  Binary
} from "lucide-react";

export default function App() {
  const [antennaType, setAntennaType] = useState<AntennaTypeId>("patch");
  const [freq, setFreq] = useState<number>(2.4); // GHz
  const [selectedSubstrate, setSelectedSubstrate] = useState<string>("felt");
  const [selectedConductive, setSelectedConductive] = useState<string>("shieldit");
  const [customThickness, setCustomThickness] = useState<number>(2.0); // mm

  // When selectedSubstrate changes, synchronize the thickness to its typical value
  useEffect(() => {
    const sub = SUBSTRATES.find((s) => s.id === selectedSubstrate);
    if (sub) {
      setCustomThickness(sub.thickness);
    }
  }, [selectedSubstrate]);

  const activeAntennaSpec = ANTENNA_TYPES.find((a) => a.id === antennaType) || ANTENNA_TYPES[0];
  const activeSubstrate = SUBSTRATES.find((s) => s.id === selectedSubstrate) || SUBSTRATES[0];
  const activeConductive = CONDUCTIVE_MATERIALS.find((c) => c.id === selectedConductive) || CONDUCTIVE_MATERIALS[0];

  // Recalculate dimensions in real-time
  const dimensions = calculateAntennaDimensions(
    antennaType,
    freq,
    activeSubstrate.epsilonR,
    customThickness
  );

  // Quick preset buttons for frequencies
  const freqPresets = [
    { label: "915 MHz (LoRa)", value: 0.915 },
    { label: "1.575 GHz (GPS)", value: 1.575 },
    { label: "2.44 GHz (WiFi/BT)", value: 2.44 },
    { label: "3.5 GHz (5G)", value: 3.5 },
    { label: "5.8 GHz (WiFi 5G)", value: 5.8 },
  ];

  const handleSendMessageToAI = async (messageContent: string): Promise<string> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: messageContent }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to communicate with Textenna AI.");
    }

    const data = await response.json();
    return data.reply;
  };

  return (
    <div className="min-h-screen bg-sky-50/50 text-slate-800 flex flex-col font-sans" id="wearlink-app-root">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md text-slate-900 border-b border-sky-100/80 shadow-xs py-4 px-6 shrink-0" id="app-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Textenna AI</h1>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-blue-200">v1.2-CST Link</span>
              </div>
              <p className="text-xs text-slate-500">Wearable & Textile Antenna Computer-Aided Engineering Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-blue-50/60 border border-blue-100/80 px-4 py-2 rounded-xl max-w-sm">
            <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="text-[11px] text-slate-600 leading-tight">
              Calculates dimensions instantly via full-wave transmission approximations. Connect with Gemini below for active debugging.
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-workspace">
        
        {/* Left Column: Configuration Parameters (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between" id="sidebar-parameters-pane">
          
          {/* Antenna Selection and Dimensions Configuration */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-slate-800 text-sm">Antenna Configuration</h2>
            </div>

            {/* Selection of Antenna Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Radiator Topology</label>
              <select
                value={antennaType}
                onChange={(e) => setAntennaType(e.target.value as AntennaTypeId)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 text-xs text-slate-800 rounded-lg p-2.5 font-medium outline-hidden transition-all cursor-pointer"
                id="select-antenna-type"
              >
                <option value="patch">Microstrip Patch (Shielded / Low SAR)</option>
                <option value="cpw_monopole">CPW-Fed Monopole (Single-sided)</option>
                <option value="pifa">Planar Inverted-F (PIFA - Compact)</option>
                <option value="dipole">Half-Wave Textile Dipole (Symmetrical)</option>
              </select>
            </div>

            {/* Target Resonant Frequency slider and preset shortcuts */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Target Frequency (f₀)</label>
                <span className="font-mono text-blue-600 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{freq} GHz</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="6.0"
                step="0.05"
                value={freq}
                onChange={(e) => setFreq(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                id="slider-frequency"
              />
              <div className="grid grid-cols-5 gap-1 pt-1">
                {freqPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setFreq(preset.value)}
                    className={`px-1 py-1 text-[9px] font-mono font-medium rounded transition-all cursor-pointer ${
                      freq === preset.value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800"
                    }`}
                    id={`btn-preset-freq-${preset.value}`}
                  >
                    {preset.value}G
                  </button>
                ))}
              </div>
            </div>

            {/* Textile Thickness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Textile Substrate Thickness (h)</label>
                <span className="font-mono text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{customThickness} mm</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="5.0"
                step="0.1"
                value={customThickness}
                onChange={(e) => setCustomThickness(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                id="slider-thickness"
              />
              <p className="text-[10px] text-slate-500 leading-tight">
                Thicker substrates separate copper lines, increasing feed efficiency and bandwidth, but make garments heavier.
              </p>
            </div>

            {/* Quick selectors for Substrate and Conductive preset */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Substrate Preset</label>
                <select
                  value={selectedSubstrate}
                  onChange={(e) => setSelectedSubstrate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 text-[11px] rounded p-1.5 font-medium text-slate-700 outline-hidden cursor-pointer"
                  id="select-substrate-preset"
                >
                  {SUBSTRATES.map((sub) => (
                    <option key={sub.id} value={sub.id} className="bg-white">
                      {sub.name} (ε={sub.epsilonR})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conductive Sheet</label>
                <select
                  value={selectedConductive}
                  onChange={(e) => setSelectedConductive(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 text-[11px] rounded p-1.5 font-medium text-slate-700 outline-hidden cursor-pointer"
                  id="select-conductive-preset"
                >
                  {CONDUCTIVE_MATERIALS.map((cond) => (
                    <option key={cond.id} value={cond.id} className="bg-white">
                      {cond.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Topology Performance Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 p-5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Topology RF Assessment</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Expected SAR</span>
                <span className={`text-xs font-bold font-mono block mt-1 ${
                  activeAntennaSpec.typicalSAR.includes("Low") ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {activeAntennaSpec.typicalSAR}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wider">Radiation Shape</span>
                <span className="text-[10px] font-bold text-blue-600 leading-tight block truncate mt-1">
                  {activeAntennaSpec.radiationPattern.split(" (")[0]}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-slate-700 font-bold block text-[11px] uppercase tracking-wider">Human Body Interactions:</strong>
                <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                  {activeAntennaSpec.bodyEffect}
                </p>
              </div>

              <div>
                <strong className="text-emerald-600 font-bold block text-[11px] uppercase tracking-wider">Key Advantages:</strong>
                <ul className="list-disc pl-4 text-slate-500 text-[11px] space-y-0.5 mt-0.5">
                  {activeAntennaSpec.advantages.slice(0, 2).map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              {antennaType !== "patch" && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded-xl p-3 flex gap-2 items-start text-[10px] leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  <div>
                    <strong>On-Body Warning:</strong> Dipole and monopole models detune drastically inside clothing close to skin. Use solid ground backings (patch/PIFA) for stable efficiency.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer, CST setup, and Chatbot (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between" id="visualizer-and-interactive-pane">
          
          {/* Visual Model Canvas */}
          <AntennaVisualizer
            type={antennaType}
            dimensions={dimensions}
            substrateName={activeSubstrate.name}
            substrateThickness={customThickness}
            conductiveName={activeConductive.name}
          />

          {/* Material encyclopedia (tabs/cards) */}
          <MaterialCard
            substrates={SUBSTRATES}
            conductiveMaterials={CONDUCTIVE_MATERIALS}
            selectedSubstrateId={selectedSubstrate}
            selectedConductiveId={selectedConductive}
            onSelectSubstrate={setSelectedSubstrate}
            onSelectConductive={setSelectedConductive}
          />

          {/* CST Studio Suite Step-by-Step wizard */}
          <CSTWorkflow
            type={antennaType}
            dimensions={dimensions}
            substrateName={activeSubstrate.name}
            substrateEpsilon={activeSubstrate.epsilonR}
            substrateThickness={customThickness}
            conductiveName={activeConductive.name}
          />

          {/* WearLink AI Intelligent RF Chat companion */}
          <ChatAssistant onSendMessage={handleSendMessageToAI} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-slate-400 border-t border-sky-100/80 py-8 px-4 text-center text-xs shrink-0" id="app-footer">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">WearLink AI Suite — Real-Time CAD & Electromagnetics Prototyping</p>
          <p className="max-w-xl mx-auto text-[11px] leading-relaxed text-slate-400">
            Design formulas computed using empirical microwave transmission formulations. Verification through full-wave solvers (CST Studio Suite, HFSS) and Vector Network Analyzer (VNA) measurements on textile prototypes is highly recommended before garment integration.
          </p>
          <div className="pt-2 text-[10px] text-blue-500 font-mono flex justify-center items-center gap-3">
            <span>Maxwell Equations Solver Mode: Active</span>
            <span>•</span>
            <span>RF Port Impedance: 50 Ohm Normalization</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
