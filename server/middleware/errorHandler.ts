import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  try {
    logger.error(
      {
        err,
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        user: (req as any).user?._id,
      },
      "Unhandled server error"
    );
  } catch (logErr) {
    // Fallback to console if logger fails
    console.error("Error logging failed", logErr);
  }

  if (err && err.name === "ValidationError") {
    res.status(422).json({ error: "Validation failed", details: err.errors });
    return;
  }

  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
}
