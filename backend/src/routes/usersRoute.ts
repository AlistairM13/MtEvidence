import express from "express";
import { loginUser, registerUser } from "../controllers/userController";
const usersRouter = express.Router();

usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

export default usersRouter;
