import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import http from "http";
import app from "./index";
import PrivateMessage from "./models/messageModel";
import User from "./models/userModel";
import { Server } from "socket.io";
dotenv.config({ path: "./config.env" });

const MONGODB_URI = process.env.MONGODB_URI!;
const AUTH_SECRET = process.env.AUTH_SECRET!;
const PORT = process.env.APP_PORT || 4000;

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose: typeof import("mongoose")) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
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
    const onlineUsers = new Map<string, string>();

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

    io.on("connection", (socket) => {
      const user = (socket as any).user;
      const userId = user.googleId ?? user?.id;
      if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log(`${userId} connected with socket ID ${socket.id}`);
      }

      socket.on("disconnect", () => {
        if (userId) {
          onlineUsers.delete(userId);
          console.log(`${userId} disconnected`);
        }
      });

      socket.on("private message", async ({ to, message }) => {
        const from = userId;
        if (!from || !to || !message) return;
        const saved = await PrivateMessage.create({ from, to, message });

        const recipientSocketId = onlineUsers.get(to);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("private message", saved);
        }

        socket.emit("private message", saved); // echo to sender;
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running with Socket.IO on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
