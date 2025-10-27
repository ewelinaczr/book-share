import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import http from "http";
import app from "./index";
import PrivateMessage from "./models/messageModel";
import User from "./models/userModel";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
const AUTH_SECRET = process.env.AUTH_SECRET!;
const PORT = process.env.APP_PORT || 4000;

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = {
    activeConnection: null,
    pendingConnectionPromise: null,
  };
}

async function connectToDatabase() {
  if (cached.activeConnection) return cached.activeConnection;

  if (!cached.pendingConnectionPromise) {
    cached.pendingConnectionPromise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose: typeof import("mongoose")) => mongoose);
  }

  cached.activeConnection = await cached.pendingConnectionPromise;
  return cached.activeConnection;
}

connectToDatabase()
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    const currentlyConnectedUsers = new Map<string, string>();

    // Before any socket connection is accepted
    io.use(async (socket, next) => {
      try {
        const tokenValue = socket.handshake.auth?.accessToken;

        if (!tokenValue) {
          console.log("Missing token in socket handshake auth");
          return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(tokenValue, AUTH_SECRET) as {
          id: string;
        };

        let user = undefined;
        user = await User.findOne({ googleId: decoded.id });

        if (!user) {
          user = await User.findById(decoded.id);
        }

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

        // If the recipient is online, send the message directly to their socke
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("private message", saved);
        }

        // Echo the message back to the sender
        socket.emit("private message", saved);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running with Socket.IO on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
