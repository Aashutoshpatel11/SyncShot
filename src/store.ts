import { create } from 'zustand';
import { generateIdentity } from './db';
import { UserProfile } from './types';


interface intialState {
  user: UserProfile | null;
  initializeUser: () => void;
}


const useStore = create<intialState>((set) => ({
  user: null,
  
  initializeUser: () => {
    const stored = localStorage.getItem('gallery_user');
    if (stord) {
      set({ user: JSON.parse(stored) });
    } else {
      const newUser = generateIdentity();
      localStorage.setItem('gallery_user', JSON.stringify(newUser));
      set({ user: newUser });
    }
  },
}));


export default useStore;