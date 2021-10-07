import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../types";

const UserSchema = new Schema<IUser, UserModel>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

UserSchema.set("timestamps", true);
UserSchema.set("toObject", {
  transform: function (_doc: any, ret: any) {
    delete ret.count;
    delete ret.password;
    return ret;
  },
});

UserSchema.methods.isValidPassword = function isValidPassword(
  password: string
) {
  return bcrypt.compare(password, this["password"]);
};

UserSchema.methods.generateToken = function generateToken({
  type,
}: {
  type: "access" | "refresh";
}) {
  const { _id: userId, count } = this;
  if (type === "refresh")
    return jwt.sign({ userId, count }, process.env.JWT_REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: "15min",
  });
};

UserSchema.static(
  "verifyToken",
  function verifyToken({
    token,
    type,
  }: {
    token: string;
    type: "access" | "refresh";
  }) {
    if (type === "access")
      return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);

    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET!);
  }
);

UserSchema.pre("save", async function callBackNext(next) {
  try {
    const hashPassword = await bcrypt.hash(this.password, 6);

    if (this.isNew || this.isModified("password")) {
      this.password = hashPassword;
      next();
    }
  } catch (err: any) {
    next(err);
  }
});

export const User = model("users", UserSchema);
