import { Request, Response } from "express";
import { User } from "./auth.model";

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

    res.cookie("access-token", emailUser.generateToken({ type: "access" }), {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 15, // 15 min
    });
    res.cookie("refresh-token", emailUser.generateToken({ type: "refresh" }), {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

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
    res.cookie("access-token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });
    res.cookie("refresh-token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });

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
    res.cookie("access-token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
    });
    res.cookie("refresh-token", "", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export { register, login, me, logout, invalidateToken };
