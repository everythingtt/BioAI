import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  username: string;
}

interface BioState {
  backendUrl: string;
  token: string | null;
  user: User | null;
  characters: any[];
  gallery: any[];
  selectedChar: any | null;
  status: any | null;
  isLoggedIn: boolean;
  
  setBackendUrl: (url: string) => void;
  setToken: (token: string | null, user?: User | null) => void;
  setSelectedChar: (char: any) => void;
  setStatus: (status: any) => void;
  logout: () => void;
  
  fetchCharacters: () => Promise<void>;
  fetchGallery: () => Promise<void>;
  checkConnection: () => Promise<void>;
}

export const useBioStore = create<BioState>((set, get) => ({
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  token: null,
  user: null,
  characters: [],
  gallery: [],
  selectedChar: null,
  status: null,
  isLoggedIn: false,

  setBackendUrl: (url) => set({ backendUrl: url }),
  setToken: (token, user = null) => set({ token, user, isLoggedIn: !!token }),
  setSelectedChar: (selectedChar) => set({ selectedChar }),
  setStatus: (status) => set({ status }),
  logout: () => set({ token: null, user: null, isLoggedIn: false, characters: [] }),

  fetchCharacters: async () => {
    const { backendUrl, token } = get();
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/api/characters`, {
        headers: { 
          'Bypass-Tunnel-Reminder': 'true',
          'Authorization': `Bearer ${token}`
        }
      });
      set({ characters: res.data });
    } catch (e) {
      console.error('Fetch characters failed', e);
    }
  },

  fetchGallery: async () => {
    const { backendUrl, token } = get();
    try {
      const res = await axios.get(`${backendUrl}/api/gallery`, {
        headers: {
          'Bypass-Tunnel-Reminder': 'true',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      set({ gallery: res.data });
    } catch (e) {
      console.error('Fetch gallery failed', e);
    }
  },

  checkConnection: async () => {
    const { backendUrl } = get();
    try {
      const res = await axios.get(`${backendUrl}/api/health`, {
        headers: { 'Bypass-Tunnel-Reminder': 'true' }
      });
      set({ status: res.data });
    } catch (e) {
      set({ status: { status: 'offline' } });
    }
  },
}));
