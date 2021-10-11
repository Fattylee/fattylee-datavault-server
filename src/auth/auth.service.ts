import { Response } from "express";
import { IUser } from "../types";

export const setAccessAndRefreshCookie = ({
  res,
  user,
  expires = false,
}: {
  res: Response;
  user: IUser;
  expires?: boolean;
}) => {
  res.cookie("access-token", user?.generateToken({ type: "access" }), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: expires ? 0 : 1000 * 60 * 15, // 15 min
  });
  res.cookie("refresh-token", user?.generateToken({ type: "refresh" }), {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: expires ? 0 : 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
