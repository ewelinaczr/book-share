import { Response, Request } from "express";
import { UserRequest } from "./authController";
import { getUserOrFail } from "../utils/auth";
import mongoose from "mongoose";
import User from "../models/userModel";
import PrivateMessage from "../models/messageModel";

export const getMessageHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req as UserRequest, res);
  if (!user) return;

  const currentUser = user._id;
  const otherUser = req.params.userId;

  try {
    const messages = await PrivateMessage.find({
      $or: [
        { from: currentUser, to: otherUser },
        { from: otherUser, to: currentUser },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getChatPartners = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const messages = await PrivateMessage.find({
      $or: [{ from: user._id }, { to: user._id }],
    });

    const otherUserIds = Array.from(
      new Set(
        messages.map((msg) =>
          msg.from === user._id ? msg.to.toString() : msg.from.toString()
        )
      )
    );

    const normalizedIds = otherUserIds.map((id) =>
      mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id
    );

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
  } catch {
    res.status(500).json("Failed to fetch messages.");
  }
};

export const deleteChatHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = getUserOrFail(req, res);
  if (!user) return;

  try {
    const result = await PrivateMessage.deleteMany({
      $or: [
        { senderId: user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: user._id },
      ],
    });

    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
