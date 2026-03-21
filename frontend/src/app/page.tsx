"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Activity, Beaker, Shield, Zap, Plus, User, 
  Settings2, Trash2, Send, Brain, Sparkles, 
  ChevronRight, Heart, AlertCircle, Lock, Unlock,
  Globe, FlaskConical, Share2
} from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
  const [characters, setCharacters] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [selectedChar, setSelectedChar] = useState<any>(null);
  const [view, setView] = useState<"lab" | "gallery">("gallery");

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [bioFeedback, setBioFeedback] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Character Creation Form
  const [charName, setCharName] = useState("");
  const [charDesc, setCharDesc] = useState("");
  const [charBack, setCharBack] = useState("");

  const checkConnection = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/health`);
      setStatus(response.data);
      fetchCharacters();
      fetchGallery();
    } catch (error) {
      console.error("Connection failed:", error);
      setStatus({ status: "offline", error: "Could not connect to local backend" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      
      const res = await axios.post(`${backendUrl}/api/auth/login`, formData);
      setToken(res.data.access_token);
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
      setView("lab");
    } catch (e) {
      alert("Login failed. Use admin/password");
    }
  };

  const fetchCharacters = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/characters`);
      setCharacters(res.data);
      if (selectedChar) {
        const updated = res.data.find((c: any) => c.id === selectedChar.id);
        if (updated) setSelectedChar(updated);
      }
    } catch (e) {
      console.error("Failed to fetch characters", e);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/gallery`);
      setGallery(res.data);
    } catch (e) {
      console.error("Failed to fetch gallery", e);
    }
  };

  const createCharacter = async (e: any) => {
    e.preventDefault();
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/api/characters`, null, {
        params: { name: charName, description: charDesc, background: charBack },
        headers: { Authorization: `Bearer ${token}` }
      });
      setCharName("");
      setCharDesc("");
      setCharBack("");
      fetchCharacters();
    } catch (e) {
      console.error("Failed to create character", e);
    }
  };

  const togglePublish = async (id: string) => {
    if (!token) return;
    try {
      await axios.post(`${backendUrl}/api/characters/${id}/publish`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCharacters();
      fetchGallery();
    } catch (e) {
      console.error("Failed to publish", e);
    }
  };

  const deleteCharacter = async (id: string) => {
    if (!token) return;
    try {
      await axios.delete(`${backendUrl}/api/characters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedChar?.id === id) setSelectedChar(null);
      fetchCharacters();
      fetchGallery();
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || !selectedChar || chatLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/chat`, {
        char_id: selectedChar.id,
        message: input,
        history: messages
      });

      setMessages(prev => [...prev, { role: "assistant", content: response.data.response }]);
      setBioFeedback(response.data.bio_feedback);
      fetchCharacters();
      fetchGallery();
    } catch (e) {
      console.error("Chat failed", e);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status?.status === 'healthy') {
        fetchCharacters();
        fetchGallery();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [status, selectedChar]);

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Activity size={12} /> Phase 5: Global Discovery
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              BioAI Network
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setView("gallery")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'gallery' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Globe size={14} /> PUBLIC GALLERY
              </button>
              <button 
                onClick={() => setView("lab")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${view === 'lab' ? 'bg-emerald-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <FlaskConical size={14} /> PRIVATE LAB
              </button>
            </div>

            <div className="h-8 w-px bg-zinc-800" />

            {!isLoggedIn ? (
              <form onSubmit={handleLogin} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Admin" 
                  value={username}
                  autoComplete="username"
                  onChange={e=>setUsername(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-xs outline-none focus:border-emerald-500/50"
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  autoComplete="current-password"
                  onChange={e=>setPassword(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 text-xs outline-none focus:border-emerald-500/50"
                />
                <button className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  <Lock size={18} />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <Unlock size={16} /> AUTHORIZED
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: SUBJECTS & TOOLS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-4">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                {view === 'lab' ? <FlaskConical size={12} /> : <Globe size={12} />} 
                {view === 'lab' ? 'Local Subjects' : 'Global Entities'}
              </h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {(view === 'lab' ? characters : gallery).map((char) => (
                  <div key={char.id} className="relative group">
                    <button 
                      onClick={() => {
                        setSelectedChar(char);
                        setMessages([]);
                        setBioFeedback("");
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${selectedChar?.id === char.id ? 'bg-emerald-500/5 border-emerald-500/40' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'}`}
                    >
                      <p className="font-bold text-sm mb-1">{char.name}</p>
                      <div className="flex gap-1 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        {Object.values(char.current_state.chemicals).map((val: any, i) => (
                          <div key={i} className="h-full bg-emerald-500/40" style={{ width: `${val}%` }} />
                        ))}
                      </div>
                    </button>
                    {isLoggedIn && view === 'lab' && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => togglePublish(char.id)}
                          className={`p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 ${char.is_published ? 'text-emerald-500' : 'text-zinc-600 hover:text-emerald-400'}`}
                        >
                          <Share2 size={12} />
                        </button>
                        <button 
                          onClick={() => deleteCharacter(char.id)}
                          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-600 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {view === 'lab' && isLoggedIn && (
                  <button 
                    onClick={() => setSelectedChar(null)}
                    className="w-full p-4 rounded-xl border border-dashed border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} /> New Subject
                  </button>
                )}
              </div>
            </div>

            {selectedChar && (
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm space-y-6">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Settings2 size={12} /> Subject Biology
                </h2>
                <div className="space-y-4">
                  {Object.entries(selectedChar.current_state.chemicals).map(([chem, val]: [string, any]) => (
                    <div key={chem} className="space-y-1">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        <span>{chem}</span>
                        <span>{Math.round(val)}%</span>
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
              </div>
            )}
          </div>

          {/* CENTER: CHAT INTERFACE */}
          <div className="lg:col-span-6 flex flex-col h-[700px] rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-md overflow-hidden relative">
            {!selectedChar ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Brain size={40} className="animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">BioAI Neural Network</h3>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    {view === 'lab' 
                      ? (isLoggedIn ? "Initialize a new local subject." : "Login to create local subjects.") 
                      : "Select a published entity from the network to begin interaction."}
                  </p>
                </div>
                
                {isLoggedIn && view === 'lab' && (
                  <form onSubmit={createCharacter} className="w-full max-w-sm space-y-3 pt-6">
                    <input placeholder="Subject Name" value={charName} onChange={e=>setCharName(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none transition-colors" />
                    <textarea placeholder="Background & Directives..." value={charBack} onChange={e=>setCharBack(e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm h-32 focus:border-emerald-500/50 outline-none transition-colors" />
                    <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10">
                      Initialize Neural Matrix
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedChar.name}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        {selectedChar.is_published ? 'NETWORK BROADCAST' : 'LOCAL INTERACTION'}
                      </p>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <button 
                      onClick={() => togglePublish(selectedChar.id)}
                      className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${selectedChar.is_published ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-zinc-800 text-zinc-500'}`}
                    >
                      {selectedChar.is_published ? 'Published' : 'Private'}
                    </button>
                  )}
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2 opacity-50">
                      <Sparkles size={24} />
                      <p className="text-sm italic">Neural path established. Send a signal.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20' 
                          : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-zinc-700'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800/80 p-4 rounded-2xl rounded-tl-none border border-zinc-700">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 pt-0">
                  <div className="relative">
                    <input 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={`Signal to ${selectedChar.name}...`}
                      className="w-full bg-black/60 border border-zinc-800 rounded-2xl px-6 py-4 pr-16 text-sm focus:border-emerald-500/50 outline-none transition-all shadow-2xl"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* RIGHT: BIO-FEEDBACK LOG */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm min-h-[300px]">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Heart size={12} className="text-red-500" /> Bio-Feedback
              </h2>
              
              {bioFeedback ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-200 leading-relaxed italic">
                    "{bioFeedback}"
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 text-center space-y-3">
                  <AlertCircle size={24} className="opacity-20" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">No Interaction Data</p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={12} /> Network Telemetry
              </h2>
              <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">Global Reach</span>
                <span className="text-emerald-400 font-mono">Tunneled</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-zinc-800/50">
                <span className="text-zinc-500">Uptime</span>
                <span className="text-zinc-300">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
