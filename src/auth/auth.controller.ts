import { Request, Response } from "express";
import { User } from "./auth.model";
import { setAccessAndRefreshCookie } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName } = req.body;
    let password = req.body.password;

    const emailUser = await User.findOne({ email });
    if (emailUser)
      return res.status(400).json({ email: "Email already exist" });

    const newUser = await User.create({ email, password, firstName, lastName });

    res.status(201).json(newUser.toObject());
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let password = req.body.password;

    const emailUser = await User.findOne({ email });
    if (!emailUser)
      return res.status(404).json({ email: "Email does not exist" });

    const passwordMatches = await emailUser.isValidPassword(password);
    if (!passwordMatches)
      return res.status(400).json({ password: "Incorrect password" });

    setAccessAndRefreshCookie({ res, user: emailUser! });
    res.status(200).json(emailUser.toObject());
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const me = async (_: any, res: Response) => {
  res.status(200).json(res.locals.user.toObject());
};

const logout = (_: any, res: Response) => {
  try {
    setAccessAndRefreshCookie({ res, user: res.locals.user!, expires: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const invalidateToken = async (_: any, res: Response) => {
  try {
    const { user } = res.locals;
    user.count = user.count + 1;
    await user.save();

    setAccessAndRefreshCookie({ res, user: user!, expires: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { register, login, me, logout, invalidateToken };
