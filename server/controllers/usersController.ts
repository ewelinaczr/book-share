import { Request, Response } from "express";
import User from "../models/userModel";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const updateUserLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      res.status(400).json("Missing latitude or longitude");
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { location: { lat, lng } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json("User not found");
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
