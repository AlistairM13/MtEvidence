import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {User} from '../types/appData';
import {zustandStorage} from './zustandStorage';

interface UserState {
  user: User | null;
}

interface SkillActions {
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState & SkillActions>()(
  persist(
    set => ({
      user: null,
      setUser: (user: User) => set({user}),
    }),
    {
      name: 'skill-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
