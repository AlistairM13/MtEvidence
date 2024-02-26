import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import { generateEmailToken } from "../utils/jsonWebToken";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password }: RegisterPayload = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing required request parameters");
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateEmailToken(user.email),
    });
  } else {
    res.status(400).json({ message: "Error registering user" });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password }: LoginPayload = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Missing required request parameter");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateEmailToken(user.email),
    });
  } else {
    res.status(401);
    throw new Error("Error logging in user");
  }
});
