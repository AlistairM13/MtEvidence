import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

interface JwtPayload {
  email: string;
  iat: number;
  exp: number;
}

export const checkAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        [, token] = req.headers.authorization.split(" ");

        // Verify token
        const { email } = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload;

        // Get user from the token
        const user = await userModel.findOne({ email }).select("-password");
        if (!user) {
          throw new Error("No valid user found");
        }

        // Forward the now authenticated user
        req.user = user;

        next();
      } catch (error: any) {
        if (error?.name === "TokenExpiredError") {
          res.status(401);
          throw new Error("Token Expired, Please log in again");
        }
        console.log(error);
        res.status(401);
        throw new Error(
          `Not authorized ${error.message ? `:${error.message}` : ""}`
        );
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
