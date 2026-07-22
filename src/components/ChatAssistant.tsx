import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Send, Sparkles, User, Cpu, AlertTriangle, ArrowRight } from "lucide-react";

interface ChatAssistantProps {
  onSendMessage: (content: string) => Promise<string>;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am **Textenna AI**, your engineering assistant for wearable and textile antenna design.\n\nI can help you:\n- **Recommend substrates** (like felt, denim, fleece) and **conductors** (like Shieldit fabric or conductive thread).\n- **Calculate antenna dimensions** and troubleshoot detuning.\n- **Guide your CST Studio Suite simulation setup** (waveguide ports, boundaries, solver settings).\n- **Explain RF concepts** like Specific Absorption Rate (SAR), impedance matching ($S_{11}$), gain, and efficiency.\n\nSelect a quick query below or type your design challenge!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const presetQueries = [
    {
      label: "How to minimize body detuning and SAR?",
      query: "How do I design a wearable antenna that minimizes human body detuning and reduces Specific Absorption Rate (SAR)?"
    },
    {
      label: "Best textile substrate for 2.4GHz WiFi?",
      query: "What is the best textile substrate and thickness to design a 2.4 GHz WiFi patch antenna? Compare felt and cotton."
    },
    {
      label: "How does bending affect resonance?",
      query: "How does physical bending and crumpling affect the resonant frequency and radiation pattern of a textile patch antenna?"
    },
    {
      label: "Patch vs CPW Monopole for wearables?",
      query: "What are the trade-offs between a Microstrip Patch antenna and a CPW-fed Monopole antenna for on-body applications?"
    }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const replyText = await onSendMessage(userMsg.content);

      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reach WearLink AI. Check your server API key.");
    } finally {
      setLoading(false);
    }
  };

  // Safe and custom lightweight Markdown parser
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, index) => {
      // Handle Code Blocks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const content = codeContent.join("\n");
          codeContent = [];
          return (
            <div key={index} className="my-2 bg-slate-900 text-sky-200/95 p-3.5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-950">
              <pre>{content}</pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // Handle Headings
      if (line.startsWith("### ")) {
        return <h4 key={index} className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-3 mb-1.5">{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={index} className="text-sm font-bold text-slate-800 mt-4 mb-2 border-b border-slate-200 pb-1">{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={index} className="text-base font-bold text-slate-800 mt-4 mb-2">{line.slice(2)}</h2>;
      }

      // Handle Bullets
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="ml-4 list-disc text-xs text-slate-600 mb-1 leading-relaxed">
            {renderInlineMarkdown(line.slice(2))}
          </li>
        );
      }

      // Handle numbered lists
      const numberedRegex = /^(\d+)\.\s(.*)/;
      if (numberedRegex.test(line)) {
        const match = line.match(numberedRegex);
        if (match) {
          return (
            <div key={index} className="flex gap-2 text-xs text-slate-600 ml-2 mb-1.5 leading-relaxed">
              <span className="font-bold text-blue-600 font-mono">{match[1]}.</span>
              <div>{renderInlineMarkdown(match[2])}</div>
            </div>
          );
        }
      }

      // Standard line
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }

      return (
        <p key={index} className="text-xs text-slate-600 leading-relaxed mb-1.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    }).filter(el => el !== null);
  };

  // Render bold, italics, inline code within text
  const renderInlineMarkdown = (text: string) => {
    let parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    while (currentText.length > 0) {
      const boldIdx = currentText.indexOf("**");
      const codeIdx = currentText.indexOf("`");

      if (boldIdx === -1 && codeIdx === -1) {
        parts.push(<span key={keyIdx++}>{currentText}</span>);
        break;
      }

      // If bold is closer
      if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
        if (boldIdx > 0) {
          parts.push(<span key={keyIdx++}>{currentText.substring(0, boldIdx)}</span>);
        }
        const rest = currentText.substring(boldIdx + 2);
        const endBoldIdx = rest.indexOf("**");
        if (endBoldIdx !== -1) {
          parts.push(
            <strong key={keyIdx++} className="font-extrabold text-slate-900">
              {rest.substring(0, endBoldIdx)}
            </strong>
          );
          currentText = rest.substring(endBoldIdx + 2);
        } else {
          parts.push(<span key={keyIdx++}>**</span>);
          currentText = rest;
        }
      } 
      // If code is closer
      else {
        if (codeIdx > 0) {
          parts.push(<span key={keyIdx++}>{currentText.substring(0, codeIdx)}</span>);
        }
        const rest = currentText.substring(codeIdx + 1);
        const endCodeIdx = rest.indexOf("`");
        if (endCodeIdx !== -1) {
          parts.push(
            <code key={keyIdx++} className="bg-sky-50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-[11px] border border-sky-100">
              {rest.substring(0, endCodeIdx)}
            </code>
          );
          currentText = rest.substring(endCodeIdx + 1);
        } else {
          parts.push(<span key={keyIdx++}>`</span>);
          currentText = rest;
        }
      }
    }

    return parts;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sky-100/80 flex flex-col h-[520px] overflow-hidden" id="card-wearlink-chat">
      {/* Chat Header */}
      <div className="bg-sky-50/40 border-b border-sky-100/80 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              Textenna RF Assistant
              <span className="bg-blue-100 text-blue-700 border border-blue-200/55 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">AI Active</span>
            </h3>
            <p className="text-[10px] text-slate-400">Expert answers for wearable electromagnetic modeling</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-sky-50/10 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            id={`chat-msg-${msg.id}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === "user" ? "bg-amber-50 text-amber-600 border-amber-200/50" : "bg-blue-50 text-blue-600 border-blue-200/50"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`rounded-2xl p-3.5 shadow-sm border ${
              msg.role === "user"
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-slate-200/80 text-slate-700"
            }`}>
              {msg.role === "user" ? (
                <p className="text-xs leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-1">
                  {parseMarkdown(msg.content)}
                </div>
              )}
              <span className={`block text-[8px] mt-2 text-right ${
                msg.role === "user" ? "text-blue-200" : "text-slate-400"
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 border border-blue-200/50 flex items-center justify-center shrink-0 animate-pulse">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[10px] text-slate-500 font-semibold font-mono ml-1">Solving Maxwell's equations...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 items-center">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Preset Fast Queries */}
      <div className="bg-sky-50/40 border-t border-sky-100/80 px-4 py-3 overflow-x-auto whitespace-nowrap flex gap-2">
        {presetQueries.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.query)}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-[10px] text-slate-600 hover:text-blue-600 font-medium rounded-full border border-slate-200 hover:border-blue-200 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            id={`preset-query-${idx}`}
          >
            {item.label}
            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="bg-white border-t border-sky-100/80 px-4 py-3 flex gap-2.5 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask about resonance, SAR, CST ports, textile losses..."
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs px-3.5 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 outline-hidden transition-all disabled:opacity-60"
          id="chat-text-input"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
          id="chat-send-submit"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
