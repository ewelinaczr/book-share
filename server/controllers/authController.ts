import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { setTokenCookie, createSendToken } from "../utils/auth";
import User from "../models/userModel";

interface DecodedToken {
  id: string;
  googleId?: string;
}

export interface UserRequest extends Request {
  user?: { _id?: string };
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser._id) {
      res.status(400).json("User ID not found after creation.");
      return;
    }
    createSendToken(newUser, 201, res);
  } catch (err: any) {
    res.status(400).json(err.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json("Please provide email and password");
    return;
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    const isValid =
      user && (await user.correctPassword(password, user.password));
    if (!isValid) {
      res.status(401).json("Incorrect email or password");
      return;
    }

    createSendToken(user, 200, res);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json("No token provided. Please log in.");
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.AUTH_SECRET!) as DecodedToken;

    const user =
      (await User.findOne({ googleId: decoded.id })) ||
      (await User.findById(decoded.id));

    if (!user || !user._id) {
      res.status(401).json("User not found or no longer exists.");
      return;
    }

    (req as any).user = { _id: user._id.toString() };
    res.locals.user = user;
    next();
  } catch {
    res.status(401).json("Invalid token or not authorized.");
  }
};

export const logout = (req: Request, res: Response): void => {
  setTokenCookie(res, "");
  res
    .status(200)
    .json({ status: "success", message: "Logged out successfully." });
};

export const getUserIdOrFail = (req: Request, res: Response): string | null => {
  const userReq = req as UserRequest;
  const userId = userReq.user?._id;

  if (!userId) {
    res.status(401).json("User not found or no longer exists.");
    return null;
  }

  return userId;
};
