import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../models/userModel";

const {
  AUTH_SECRET = "",
  JWT_COOKIE_EXPIRES_IN = "7",
  JWT_EXPIRES_IN = "7d",
  NODE_ENV = "development",
} = process.env;

const isProd = NODE_ENV !== "development";

export const signToken = (id: string) => {
  return jwt.sign({ id }, AUTH_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user._id.toString());
  setTokenCookie(res, token);
  user.password = undefined;
  user.passwordConfirm = undefined;
  res.status(statusCode).json(user);
};

export const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
};
