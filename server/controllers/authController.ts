import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const AUTH_SECRET = process.env.AUTH_SECRET!;
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
const NODE_ENV = process.env.NODE_ENV;

const signToken = (id: string) => {
  // Use the same secret as NextAuth and the socket/server verification
  return jwt.sign({ id }, AUTH_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + parseInt(JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: NODE_ENV !== "development" ? "none" : "lax",
    secure: NODE_ENV !== "development",
  });

  (user as any).password = undefined;
  (user as any).passwordConfirm = undefined;

  res.status(statusCode).json(user);
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
    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message: "No token provided. Please log in.",
      });
      return;
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, AUTH_SECRET) as {
      id: string;
    };
    let user = undefined;
    user = await User.findOne({ googleId: decoded.id });
    if (!user) {
      user = await User.findById(decoded.id);
    }
    if (!user || !user._id) {
      res.status(401).json({
        status: "error",
        message: "User not found or no longer exists.",
      });
      return;
    }
    // Attach user ID to request
    req.user = { _id: user._id.toString() };
    res.locals.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({
      status: "error",
      message: "Invalid token or not authorized.",
    });
  }
};

export const isLoggedIn = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.cookies.jwt) {
      // Verify the JWT from cookies
      const token = req.cookies.jwt;
      const decoded = jwt.verify(token, AUTH_SECRET) as {
        accessToken: string;
        id: string;
      };
      // Check if the user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }
      // Save user data to res.locals for use in routes
      res.locals.user = user;
      return next();
    }
    // If no JWT, call next() so the route can handle unauthenticated state
    return next();
  } catch (err: any) {
    res.status(401).json({
      status: "error",
      message: "User is not logged in or token is invalid.",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: NODE_ENV !== "development" ? "none" : "lax",
    secure: NODE_ENV !== "development",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
};

export const me = (req: Request, res: Response) => {
  res.status(200).json(res.locals.user ?? null);
};
