import dotenv from "dotenv";
import http from "http";
import app from "./index";
import logger from "./utils/logger";
import { Server } from "socket.io";
import { connectToDatabase } from "./utils/db";
import { setupSocketServer } from "./services/socketService";

dotenv.config();

const PORT = process.env.APP_PORT || 4000;

connectToDatabase()
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    setupSocketServer(io);

    server.listen(PORT, () => {
      logger.info({ port: PORT }, `Server running with Socket.IO`);
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to connect to MongoDB");
    if (process.env.NODE_ENV === "production") process.exit(1);
  });

// Global process handlers
process.on("unhandledRejection", (reason: any) => {
  logger.error({ reason }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (err: any) => {
  logger.fatal({ err }, "Uncaught Exception");
  if (process.env.NODE_ENV === "production") process.exit(1);
});
