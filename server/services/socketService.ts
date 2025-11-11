import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import PrivateMessage from "../models/messageModel";

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
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(tokenValue, AUTH_SECRET) as { id: string };

      let user =
        (await User.findOne({ googleId: decoded.id })) ||
        (await User.findById(decoded.id));

      if (!user || !user._id) {
        console.log("No logged in user");
        return;
      }

      (socket as any).user = user;
      next();
    } catch (err) {
      console.log("Socket auth error:", err);
      next(new Error("Authentication error"));
    }
  });

  // Every time a new user connects to the WebSocket server
  io.on("connection", (socket) => {
    const user = (socket as any).user;
    const userId = user.googleId ?? user?.id;

    if (userId) {
      currentlyConnectedUsers.set(userId, socket.id);
      console.log(`${userId} connected with socket ID ${socket.id}`);
    }

    socket.on("disconnect", () => {
      if (userId) {
        currentlyConnectedUsers.delete(userId);
        console.log(`${userId} disconnected`);
      }
    });

    // Listen for private messages
    socket.on("private message", async ({ to, message }) => {
      const from = userId;

      if (!from || !to || !message) return;

      const saved = await PrivateMessage.create({ from, to, message });

      const recipientSocketId = currentlyConnectedUsers.get(to);

      // If the recipient is online, send the message directly to their socket
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("private message", saved);
      }

      // Echo the message back to the sender
      socket.emit("private message", saved);
    });
  });
};
