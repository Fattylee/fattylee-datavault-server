import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import { setUserId } from "./auth/auth.middleware";
import { authRouter } from "./auth/auth.route";
import { startConnection } from "./config/connection";

config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(setUserId);

app.use("/api/v1/", authRouter);

app.get("/api/v1", (_req, res) => {
  res.status(200).json({ message: "Welcome to DataVault API's" });
});

startConnection(app);
