import { Request, Response } from "express";
import { handleError } from "../utils/auth";
import User from "../models/userModel";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const updateUserLocation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      res.status(400).json({ error: "Missing latitude or longitude" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { location: { lat, lng } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (err: any) {
    handleError(res, err);
  }
};

export const deleteUserAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(null);
  } catch (err: any) {
    handleError(res, err);
  }
};
