import { Router } from "express";
import {
  invalidateToken,
  login,
  logout,
  me,
  register,
} from "./auth.controller";
import { authGuard } from "./auth.middleware";
import { loginValidator, signupValidator } from "./auth.validator";

export const authRouter = Router();

authRouter.post("/register", signupValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.get("/me", authGuard, me);
authRouter.get("/logout", authGuard, logout);
authRouter.get("/invalidate-token", authGuard, invalidateToken);
