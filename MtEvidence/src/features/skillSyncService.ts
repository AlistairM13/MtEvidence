import axios from '../config/axios';
import {Skill} from '../types/appData';

export const syncAllSkills = async (skills: Skill[]) => {
  const response = await axios.post('/skills/syncAllSkills', {skills});
  return response.data;
};
