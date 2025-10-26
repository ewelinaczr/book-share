import { Response, Request } from "express";
import { UserRequest } from "./authController";
import mongoose from "mongoose";
import User from "../models/userModel";
import PrivateMessage from "../models/messageModel";

export const getMessageHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userReq = req as UserRequest;

  if (!userReq) {
    res.status(401).json("User not found or no longer exists.");
    return;
  }

  const otherUser = userReq.params.userId;
  const currentUser = userReq.user?._id;

  try {
    const messages = await PrivateMessage.find({
      $or: [
        { from: currentUser, to: otherUser },
        { from: otherUser, to: currentUser },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch {
    res.status(500).json("Failed to fetch messages.");
  }
};

export const getChatPartners = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userReq = req as UserRequest;
  if (!userReq) {
    res.status(401).json("User not found or no longer exists.");
    return;
  }

  const currentUserId = userReq.user?._id;

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
