import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const signToken = (id: string) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string } as jwt.SignOptions
  );
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser._id) {
      res.status(400).json({
        status: "error",
        message: "User ID not found after creation.",
      });
      return;
    }
    const token = signToken(newUser._id.toString());

    (newUser as any).password = undefined;
    (newUser as any).passwordConfirm = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      status: "error",
      message: "Please provide email and password",
    });
    return;
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      !(await (user as any).correctPassword(password, user.password))
    ) {
      res.status(401).json({
        status: "error",
        message: "Incorrect email or password",
      });
      return;
    }
    if (!user._id) {
      res.status(400).json({ status: "error", message: "User ID not found." });
      return;
    }
    const token = signToken(user._id.toString());

    (user as any).password = undefined;
    (user as any).passwordConfirm = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

interface UserRequest extends Request {
  user?: { _id: string };
}

export const protect = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access.",
      });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await User.findById(decoded.id);
    if (!user || !user._id) {
      res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists.",
      });
      return;
    }
    req.user = { _id: user._id.toString() };
    next();
  } catch (err: any) {
    res.status(401).json({
      status: "error",
      message: "Invalid token or not authorized.",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
};
