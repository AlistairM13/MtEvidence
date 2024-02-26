import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {Skill} from '../types/appData';
import {zustandStorage} from './zustandStorage';

interface SkillState {
  skills: Skill[];
}

interface SkillActions {
  addSkill: (newSkill: Skill) => void;
  setSkills: (skills: Skill[]) => void;
  updateSkill: (updatedSkill: Skill) => void;
  deleteSkill: (skillToDelete: Skill) => void;
  addJournalEntry: (skillId: string, entry: string) => void;
  getSkillById: (skillId: string) => Skill | undefined;
}

export const useSkillStore = create<SkillState & SkillActions>()(
  persist(
    (set, get) => ({
      skills: [
        {
          id: 'dummy',
          journal: [],
          name: 'dummy',
          userId: '0',
          progress: 0,
          imageInHead: 'dummy',
        },
      ],
      setSkills: (skills: Skill[]) => {
        const dummy = {
          id: 'dummy',
          journal: [],
          name: 'dummy',
          userId: '0',
          progress: 0,
          imageInHead: 'dummy',
        };

        set({skills: [dummy, ...skills]});
      },
      addSkill: (newSkill: Skill) =>
        set(state => ({skills: [...state.skills, newSkill]})),
      updateSkill: (updatedSkill: Skill) =>
        set(state => ({
          skills: state.skills.map(skill =>
            skill.id === updatedSkill.id ? updatedSkill : skill,
          ),
        })),
      addJournalEntry: (skillId: string, entry: string) =>
        set(state => ({
          skills: state.skills.map(skill =>
            skill.id === skillId
              ? {
                  ...skill,
                  journal: [
                    ...skill.journal,
                    {entry, timestamp: new Date().getTime()},
                  ],
                }
              : skill,
          ),
        })),
      deleteSkill: (skillToDelete: Skill) =>
        set(state => ({
          skills: state.skills.filter(skill => skill.id !== skillToDelete.id),
        })),
      getSkillById: (skillId: string) =>
        get().skills.find(skill => skill.id === skillId),
    }),
    {
      name: 'skill-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
