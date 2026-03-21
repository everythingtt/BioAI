import { create } from 'zustand';
import axios from 'axios';

interface BioState {
  backendUrl: string;
  token: string | null;
  characters: any[];
  gallery: any[];
  selectedChar: any | null;
  status: any | null;
  isLoggedIn: boolean;
  
  setBackendUrl: (url: string) => void;
  setToken: (token: string | null) => void;
  setSelectedChar: (char: any) => void;
  setStatus: (status: any) => void;
  
  fetchCharacters: () => Promise<void>;
  fetchGallery: () => Promise<void>;
  checkConnection: () => Promise<void>;
}

export const useBioStore = create<BioState>((set, get) => ({
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  token: null,
  characters: [],
  gallery: [],
  selectedChar: null,
  status: null,
  isLoggedIn: false,

  setBackendUrl: (url) => set({ backendUrl: url }),
  setToken: (token) => set({ token, isLoggedIn: !!token }),
  setSelectedChar: (selectedChar) => set({ selectedChar }),
  setStatus: (status) => set({ status }),

  fetchCharacters: async () => {
    const { backendUrl } = get();
    try {
      const res = await axios.get(`${backendUrl}/api/characters`);
      set({ characters: res.data });
    } catch (e) {
      console.error('Fetch characters failed', e);
    }
  },

  fetchGallery: async () => {
    const { backendUrl } = get();
    try {
      const res = await axios.get(`${backendUrl}/api/gallery`);
      set({ gallery: res.data });
    } catch (e) {
      console.error('Fetch gallery failed', e);
    }
  },

  checkConnection: async () => {
    const { backendUrl } = get();
    try {
      const res = await axios.get(`${backendUrl}/api/health`);
      set({ status: res.data });
    } catch (e) {
      set({ status: { status: 'offline' } });
    }
  },
}));
