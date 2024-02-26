import axios from '../../../config/axios';
import {Skill} from '../../../types/appData';

export type SkillPayload = {
  name: string;
  imageInHead: string;
};

export const getAllSkillsService = async () => {
  const response = await axios.get('/skills');
  return response.data;
};

export const addNewSkillService = async (skill: SkillPayload) => {
  const response = await axios.post('/skills', skill);
  return response.data;
};

export const updateSkillService = async (skill: Skill) => {
  const response = await axios.put(`/skills/${skill.id}`, skill);
  return response.data;
};

export const deleteSkillService = async (skill: Skill) => {
  const response = await axios.delete(`/skills/${skill.id}`);
  return response.data;
};
