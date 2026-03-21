"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useBioStore } from "@/store/bioStore";
import { Widget } from "@/components/ui/Widget";
import { 
  Send, Brain, Sparkles, User, Heart, 
  ChevronRight, AlertCircle, Activity 
} from "lucide-react";
import axios from "axios";

export default function InteractionChamber() {
  const { id } = useParams();
  const { backendUrl, status } = useBioStore();
  
  const [character, setCharacter] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bioFeedback, setBioFeedback] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchCharacter = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/characters/${id}`);
      setCharacter(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (status?.status === 'healthy') fetchCharacter();
  }, [status, id]);

  // Auto-refresh bio-data
  useEffect(() => {
    const interval = setInterval(() => {
      if (status?.status === 'healthy' && character) fetchCharacter();
    }, 5000);
    return () => clearInterval(interval);
  }, [status, character]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, {
        char_id: id,
        message: input,
        history: messages
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
      setBioFeedback(res.data.bio_feedback);
      fetchCharacter();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!character) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
      {/* Sidebar: Subject Identity */}
      <div className="lg:col-span-3 space-y-6 flex flex-col">
        <Widget title="Subject Identity" icon={<User size={14} />}>
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-zinc-800 mx-auto flex items-center justify-center text-emerald-500 border-2 border-zinc-700 shadow-xl">
              <User size={40} />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{character.name}</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Neural Entity</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 text-xs text-zinc-400 leading-relaxed italic">
              {character.description}
            </div>
          </div>
        </Widget>

        <Widget title="Live Bio-Telemetry" icon={<Activity size={14} />} className="flex-1">
          <div className="space-y-4">
            {Object.entries(character.current_state.chemicals).map(([chem, val]: [string, any]) => (
              <div key={chem} className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                  <span>{chem}</span>
                  <span className={val > 70 ? 'text-emerald-400' : val < 30 ? 'text-orange-400' : 'text-zinc-400'}>
                    {Math.round(val)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      chem === 'dopamine' ? 'bg-emerald-500' : 
                      chem === 'serotonin' ? 'bg-blue-500' : 
                      chem === 'cortisol' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-500'
                    }`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Widget>
      </div>

      {/* Center: Interaction Chamber */}
      <div className="lg:col-span-6 flex flex-col h-full rounded-[2.5rem] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-800/50 bg-zinc-900/20 flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div>
            <h3 className="font-bold">Interaction Active</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Neural Bridge Established</p>
          </div>
        </div>

        {/* Chat Log */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4 opacity-50">
              <Brain size={48} className="animate-pulse" />
              <p className="text-sm italic font-mono uppercase tracking-widest">Awaiting signal from user...</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-xl shadow-emerald-900/20' 
                  : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-zinc-700/50 shadow-lg'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/80 px-6 py-4 rounded-3xl rounded-tl-none border border-zinc-700/50">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-8 pt-0">
          <div className="relative group">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Signal to ${character.name}...`}
              className="w-full bg-black/60 border border-zinc-800 rounded-[2rem] px-8 py-5 pr-20 text-sm focus:border-emerald-500/50 outline-none transition-all shadow-2xl group-hover:bg-black/80"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Right Sidebar: Bio-Feedback */}
      <div className="lg:col-span-3 space-y-6 flex flex-col">
        <Widget title="Bio-Feedback" icon={<Heart size={14} className="text-red-500" />} className="flex-1">
          {bioFeedback ? (
            <div className="space-y-6 h-full flex flex-col">
              <div className="flex-1 p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-200 leading-relaxed italic relative">
                <Sparkles className="absolute -top-2 -right-2 text-emerald-500/20" size={32} />
                "{bioFeedback}"
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  <ChevronRight size={14} className="text-emerald-500" />
                  Neural Interpretation
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-[10px] text-zinc-500">
                  Chemical states are currently influencing the system prompt instructions in real-time.
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-800 text-center space-y-4">
              <AlertCircle size={32} className="opacity-20" />
              <p className="text-[10px] uppercase font-bold tracking-widest">No Interaction Data Collected</p>
            </div>
          )}
        </Widget>

        <Widget title="Network" icon={<Globe size={14} />}>
          <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/50">
            <span className="text-zinc-500">Stability</span>
            <span className="text-emerald-400 font-mono">98.2%</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2">
            <span className="text-zinc-500">Region</span>
            <span className="text-zinc-300 uppercase tracking-widest text-[10px] font-bold">Local Host</span>
          </div>
        </Widget>
      </div>
    </div>
  );
}
