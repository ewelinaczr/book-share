import express from "express";
import PrivateMessage from "../models/messageModel";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import mongoose from "mongoose";

const AUTH_SECRET = process.env.AUTH_SECRET!;

const chatRouter = express.Router();

chatRouter.get("/history/:userId", (async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "No token provided. Please log in.",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, AUTH_SECRET) as {
    id: string;
    googleId?: string;
  };
  let user = undefined;
  user = await User.findOne({ googleId: decoded.id });
  if (!user) {
    console.log("bo gg user found");
    user = await User.findById(decoded.id);
  }
  if (!user || !user._id) {
    res.status(401).json({
      status: "error",
      message: "User not found or no longer exists.",
    });
    return;
  }
  const otherUser = req.params.userId;
  const currentUser = user.googleId ?? user.id;
  try {
    const messages = await PrivateMessage.find({
      $or: [
        { from: currentUser, to: otherUser },
        { from: otherUser, to: currentUser },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}) as express.RequestHandler);

chatRouter.get("/partners", (async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "No token provided. Please log in.",
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, AUTH_SECRET) as {
    id: string;
  };
  let user = undefined;
  user = await User.findOne({ googleId: decoded.id });
  if (!user) {
    user = await User.findById(decoded.id);
  }
  if (!user || !user._id) {
    res.status(401).json({
      status: "error",
      message: "User not found or no longer exists.",
    });
    return;
  }
  const currentUserId = user.id;
  try {
    const messages = await PrivateMessage.find({
      $or: [{ from: currentUserId }, { to: currentUserId }],
    });
    const otherUserIds = Array.from(
      new Set(
        messages.map((msg) =>
          msg.from === currentUserId ? msg.to.toString() : msg.from.toString()
        )
      )
    );
    const normalizedIds = otherUserIds.map((id) => {
      return mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : id;
    });
    const users = await User.find({
      $or: [
        {
          _id: {
            $in: normalizedIds.filter(
              (id) => id instanceof mongoose.Types.ObjectId
            ),
          },
        },
        {
          googleId: {
            $in: normalizedIds.filter((id) => typeof id === "string"),
          },
        },
      ],
    }).select("name _id googleId");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}) as express.RequestHandler);

export default chatRouter;
