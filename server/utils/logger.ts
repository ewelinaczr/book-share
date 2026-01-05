import pino from "pino";
import pinoHttp from "pino-http";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard" },
      }
    : undefined,
});

export const httpLogger = pinoHttp({ logger });

export default logger;
