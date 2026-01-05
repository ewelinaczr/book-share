import dotenv from "dotenv";
import http from "http";
import app from "./index";
import logger from "./utils/logger";
import { Server } from "socket.io";
import { connectToDatabase } from "./utils/db";
import { setupSocketServer } from "./services/socketService";

dotenv.config();

const PORT = Number(process.env.PORT ?? 4000);

connectToDatabase()
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.APP_URL || "http://localhost:3000",
        credentials: true,
      },
    });

    setupSocketServer(io);

    // Bind explicitly to 0.0.0.0 to ensure IPv4 accessibility on all hosts
    server.listen(PORT, "0.0.0.0", () => {
      logger.info({ port: PORT }, `Server running with Socket.IO`);
      const address = server.address();
      logger.info({ address }, "Server listening address");
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
