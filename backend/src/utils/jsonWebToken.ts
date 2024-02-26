import jwt from "jsonwebtoken";

export const generateEmailToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "365d",
  });
  return token;
};
