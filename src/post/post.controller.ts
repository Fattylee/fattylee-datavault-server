import { Request, Response } from "express";
import { Post } from "./post.model";

const createPost = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { user } = res.locals;
    const newPost = await Post.create({ message, owner: user.id });

    res.status(201).json({ success: true, result: newPost });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllPosts = async (_: any, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("owner", "-count -password")
      .sort({ createdAt: "-1" });
    res.status(200).json({ success: true, result: posts });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { createPost, getAllPosts };
