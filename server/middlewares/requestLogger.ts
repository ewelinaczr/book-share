import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    // Log compact request completion info
    logger.info(
      { method: req.method, url: req.originalUrl, responseTime },
      "Request completed"
    );
  });

  next();
}
