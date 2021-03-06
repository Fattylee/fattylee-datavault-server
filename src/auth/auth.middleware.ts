import { NextFunction, Request, Response } from "express";
import { ITokenPayload } from "../types";
import { User } from "./auth.model";
import { setAccessAndRefreshCookie } from "./auth.service";

const authGuard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = res.locals;
    if (!userId) throw new Error("Unauthenticated");

    const user = await User.findOne({ _id: userId });

    if (!user) throw new Error("Unauthenticated");

    res.locals.user = user;
    return next();
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({ error: error?.message });
  }
};

const setUserId = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];

  if (!accessToken && !refreshToken) return next();

  try {
    const payload = User.verifyToken({
      token: accessToken,
      type: "access",
    });

    res.locals.userId = payload.userId;
    return next();
  } catch (_error: any) {}

  let refreshTokenPayload: ITokenPayload;
  try {
    refreshTokenPayload = User.verifyToken({
      token: refreshToken,
      type: "refresh",
    });
  } catch (_error: any) {
    return next();
  }

  const { userId, count } = refreshTokenPayload;
  const user = await User.findOne({ _id: userId });
  if (user?.count !== count) return next();

  setAccessAndRefreshCookie({ res, user: user! });

  res.locals.userId = userId;
  next();
};

export { authGuard, setUserId };
