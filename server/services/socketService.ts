import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import PrivateMessage from "../models/messageModel";
import logger from "../utils/logger";

export const setupSocketServer = (io: Server) => {
  const AUTH_SECRET = process.env.AUTH_SECRET;
  if (!AUTH_SECRET) {
    throw new Error("Missing AUTH_SECRET in environment variables");
  }

  const currentlyConnectedUsers = new Map<string, string>();

  // Before any socket connection is accepted
  io.use(async (socket, next) => {
    try {
      const tokenValue = socket.handshake.auth?.accessToken;

      if (!tokenValue) {
        logger.warn({ socketId: socket.id }, "Socket auth missing token");
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(tokenValue, AUTH_SECRET) as { id: string };

      let user =
        (await User.findOne({ googleId: decoded.id })) ||
        (await User.findById(decoded.id));

      if (!user || !user._id) {
        logger.warn(
          { socketId: socket.id, decodedId: decoded?.id },
          "No logged in user for socket"
        );
        return next(new Error("Authentication error"));
      }

      (socket as any).user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // Every time a new user connects to the WebSocket server
  io.on("connection", (socket) => {
    const user = (socket as any).user;
    const userId = user.googleId ?? user?.id;

    if (userId) {
      currentlyConnectedUsers.set(userId, socket.id);
      logger.info({ userId, socketId: socket.id }, "User connected");
    }

    socket.on("disconnect", () => {
      if (userId) {
        currentlyConnectedUsers.delete(userId);
        logger.info({ userId, socketId: socket.id }, "User disconnected");
      }
    });

    // Listen for private messages
    socket.on("private message", async ({ to, message }, callback) => {
      const recipientSocketId = currentlyConnectedUsers.get(to);
      try {
        // Validate data
        if (!to || !message) {
          return callback?.({ status: "error", message: "Missing fields" });
        }

        // Save to DB
        const saved = await PrivateMessage.create({
          from: (socket as any).user.googleId ?? (socket as any).user._id,
          to,
          message,
        });

        // Echo the message back to the sender if successful
        if (callback) {
          callback({ status: "ok", data: saved });
        }

        // Send to recipient

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("private message", saved);
        }
        logger.info(
          { to, recipientSocketId },
          "Private message delivered to recipient socket"
        );
      } catch (error) {
        // Echo the message back to the sender if error occurs
        if (callback) {
          callback({ status: "error", message: "Internal server error" });
          logger.info(
            { to, recipientSocketId },
            "Error delivering private message to recipient socket"
          );
        }
      }
    });
  });
};
