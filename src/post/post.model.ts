import { Schema, model } from "mongoose";

import { IPost } from "../types";

const PostSchema = new Schema<IPost>({
  message: {
    type: String,
    required: true,
    maxlength: 200,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

PostSchema.set("timestamps", true);

export const Post = model("posts", PostSchema);
