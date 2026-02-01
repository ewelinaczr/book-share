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

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const tokenValue = socket.handshake.auth?.accessToken;

      if (!tokenValue) {
        logger.warn({ socketId: socket.id }, "Socket auth missing token");
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(tokenValue, AUTH_SECRET) as { id: string };

      const user =
        (await User.findOne({ googleId: decoded.id })) ||
        (await User.findById(decoded.id));

      if (!user || !user._id) {
        logger.warn(
          { socketId: socket.id, decodedId: decoded?.id },
          "No logged in user for socket",
        );
        return next(new Error("Authentication error"));
      }
      // Attach the Logged-In User's data to this specific socket connection (data from Mongo db)
      (socket as any).user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user;
    // SELF: Identify the Logged-In User's ID
    const userId = String(user.googleId ?? user._id);

    // SELF-ROOM: Put the Logged-In User into their own private room "personal mailbox"
    // This allows sending messages to a specific User ID
    socket.join(userId);
    logger.info(
      { userId, socketId: socket.id },
      "Logged-In User joined their own room",
    );

    socket.on("disconnect", () => {
      logger.info({ userId }, "Logged-In User disconnected");
    });

    //OUTGOING MESSAGE: The Logged-In User sends a message to someone else
    socket.on("private message", async ({ to, message }, callback) => {
      try {
        if (!to || !message) {
          // 'to' is the External Recipient's ID
          return callback?.({ status: "error", message: "Missing fields" });
        }

        // Save the interaction to the database
        const saved = await PrivateMessage.create({
          from: userId, // Logged-In User
          to: String(to), // External Recipient
          message: message.trim(),
        });

        // CONFIRMATION: Tell the Logged-In User that it was sent successfully
        if (callback) {
          callback({ status: "ok", data: saved });
        }

        // DELIVERY: Send the message to the External Recipient's "mailbox" (room)
        // This broadcasts the message to every tab/device User 2 has open
        io.to(String(to)).emit("private message", saved);

        logger.info(
          { from: userId, to, messageId: saved._id },
          "Message delivered from Logged-In User to External Recipient room",
        );
      } catch (error) {
        logger.error(
          { error, from: userId, to },
          "Failed to send private message",
        );
        if (callback) {
          callback({ status: "error", message: "Internal server error" });
        }
      }
    });
  });
};
