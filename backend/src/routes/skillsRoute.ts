import express from "express";
import {
  addNewSkill,
  syncAllSkills,
  updateSkill,
  deleteSkill,
  getAllSkillsByUser,
} from "../controllers/skillsController";
import { checkAuth } from "../middlewares/authMiddleware";

const skillsRouter = express.Router();

skillsRouter.get("/", checkAuth, getAllSkillsByUser);
skillsRouter.post("/", checkAuth, addNewSkill);
skillsRouter.put("/:skillId", checkAuth, updateSkill);
skillsRouter.delete("/:skillId", checkAuth, deleteSkill);
skillsRouter.post("/syncAllSkills", checkAuth, syncAllSkills);

export default skillsRouter;
