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

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id.toString());

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) *
          24 *
          60 *
          60 *
          1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
    secure: process.env.NODE_ENV !== "development",
  });

  (user as any).password = undefined;
  (user as any).passwordConfirm = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
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
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
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
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
    secure: process.env.NODE_ENV !== "development",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
};

export const me = (req: Request, res: Response) => {
  res.status(200).json(res.locals.user ?? null);
};
