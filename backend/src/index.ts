import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./services/mongodb";
import skillsRouter from "./routes/skillsRoute";

import dotenv from "dotenv";
import usersRouter from "./routes/usersRoute";
import errorHandler from "./middlewares/errorMiddleware";
dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

app.use("/api/users", usersRouter);
app.use("/api/skills", skillsRouter);

app.use(errorHandler);

server.listen(PORT, () => {
  console.log("Server running on PORT " + PORT);
});

export default app;
