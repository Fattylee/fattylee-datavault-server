import { Router } from "express";
import { authGuard } from "../auth/auth.middleware";
import { createPost, getAllPosts } from "./post.controller";
import { createPostValidator } from "./post.validator";

export const postRouter = Router();

postRouter.post("/", createPostValidator, authGuard, createPost);
postRouter.get("/", getAllPosts);
