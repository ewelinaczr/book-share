import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { IUser } from "../models/userModel";
import { UserRequest } from "../controllers/authController";
import logger from "./logger";

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

export const getUserOrFail = (
  req: UserRequest,
  res: Response
): { _id: string } | null => {
  const user = req.user;

  if (!user || typeof user._id !== "string") {
    logger.warn(
      { ip: (req as any).ip, path: req.originalUrl },
      "Unauthorized request - user missing"
    );
    res.status(401).json("User not found or no longer exists.");
    return null;
  }

  return { _id: user._id };
};

export const handleError = (res: Response, err: any): void => {
  logger.error({ err }, "Controller error");
  if (err && err.name === "ValidationError") {
    res.status(422).json({ error: "Validation failed", details: err.errors });
  } else {
    res.status(err?.statusCode || 500).json({
      error: err?.message,
      code: err?.code || "Internal Server Error",
    });
  }
};

export const comparePasswords = async (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, userPassword);
};
