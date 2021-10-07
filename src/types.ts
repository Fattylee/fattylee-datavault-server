import { Model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  count: number;
  generateToken(option: { type: "access" | "refresh" }): string | undefined;
  isValidPassword(password: string): Promise<boolean>;
}

export interface ITokenPayload {
  userId: string;
  count?: number;
}

export interface UserModel extends Model<IUser> {
  verifyToken(option: {
    token: string;
    type: "access" | "refresh";
  }): ITokenPayload;
}
