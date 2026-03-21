"use client";

import { useState, useEffect } from "react";
import { useBioStore } from "@/store/bioStore";
import { Widget } from "@/components/ui/Widget";
import { 
  FlaskConical, Lock, Unlock, Plus, 
  Trash2, Share2, User, Activity, Zap 
} from "lucide-react";
import axios from "axios";

export default function Laboratory() {
  const { 
    characters, fetchCharacters, token, setToken, 
    isLoggedIn, backendUrl, status 
  } = useBioStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Create Form
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    if (status?.status === 'healthy') fetchCharacters();
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const res = await axios.post(`${backendUrl}/api/auth/login`, formData);
      setToken(res.data.access_token);
    } catch (e) {
      alert("Unauthorized. BioAI Engine requires valid credentials.");
    }
  };

  const createCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/characters`, null, {
        params: { name, description: desc, background: back },
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(""); setDesc(""); setBack("");
      fetchCharacters();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      await axios.delete(`${backendUrl}/api/characters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCharacters();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublish = async (id: string) => {
    try {
      await axios.post(`${backendUrl}/api/characters/${id}/publish`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCharacters();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto pt-20 px-6">
        <Widget title="Access Restricted" icon={<Lock size={14} />}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FlaskConical className="mx-auto text-emerald-500 mb-4" size={48} />
              <h2 className="text-xl font-bold">Neural Engine Login</h2>
              <p className="text-zinc-500 text-xs">Enter your laboratory credentials to manage biological subjects.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="text" placeholder="Admin Username" value={username} onChange={e=>setUsername(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
              />
              <input 
                type="password" placeholder="Laboratory Key" value={password} onChange={e=>setPassword(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500/50 outline-none"
              />
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all">
                AUTHORIZE BRIDGE
              </button>
            </form>
          </div>
        </Widget>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12 flex justify-between items-end mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Unlock size={12} /> Authorized Session
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Private Laboratory</h1>
        </div>
      </div>

      {/* Subject Creator */}
      <div className="lg:col-span-4 space-y-6">
        <Widget title="Initialize Subject" icon={<Plus size={14} />}>
          <form onSubmit={createCharacter} className="space-y-4">
            <input 
              placeholder="Subject Name" value={name} onChange={e=>setName(e.target.value)}
              className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2 text-sm"
            />
            <textarea 
              placeholder="Description..." value={desc} onChange={e=>setDesc(e.target.value)}
              className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2 text-sm h-20"
            />
            <textarea 
              placeholder="Background Directives..." value={back} onChange={e=>setBack(e.target.value)}
              className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-2 text-sm h-32"
            />
            <button className="w-full bg-zinc-100 text-black font-bold py-3 rounded-xl hover:bg-white transition-colors">
              INJECT BIOLOGY
            </button>
          </form>
        </Widget>
      </div>

      {/* Subject Management */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((char) => (
          <Widget key={char.id} title={char.name} icon={<Activity size={14} />}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-500 border border-zinc-700">
                  <User size={20} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePublish(char.id)}
                    className={`p-2 rounded-xl border transition-all ${char.is_published ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-emerald-400'}`}
                  >
                    <Share2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteCharacter(char.id)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(char.current_state.chemicals).map(([chem, val]: [string, any]) => (
                  <div key={chem} className="space-y-1">
                    <div className="flex justify-between text-[8px] uppercase font-bold text-zinc-500">
                      <span>{chem}</span>
                      <span>{Math.round(val)}%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${chem === 'dopamine' ? 'bg-emerald-500' : chem === 'cortisol' ? 'bg-red-500' : 'bg-zinc-500'}`}
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                <span className={`text-[10px] font-bold uppercase ${char.is_published ? 'text-emerald-500' : 'text-zinc-600'}`}>
                  {char.is_published ? 'NETWORK ACTIVE' : 'LOCAL ONLY'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">ID: {char.id.split('-')[0]}</span>
              </div>
            </div>
          </Widget>
        ))}
      </div>
    </div>
  );
}
