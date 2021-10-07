import { Router } from "express";
import { login, register } from "./auth.controller";
import { loginValidator, signupValidator } from "./auth.validator";

export const authRouter = Router();

authRouter.post("/register", signupValidator, register);
authRouter.post("/login", loginValidator, login);
