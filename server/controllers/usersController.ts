import { Request, Response } from "express";
import { getUserOrFail, handleError } from "../utils/auth";
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

export const updateUserPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      res
        .status(400)
        .json({ error: "No photo uploaded. Field name must be 'photo'" });
      return;
    }

    if (!file.mimetype.startsWith("image/")) {
      res.status(400).json({ error: "Uploaded file is not an image" });
      return;
    }

    const update = {
      photo: {
        data: file.buffer,
        contentType: file.mimetype,
        size: file.size,
        filename: file.originalname,
      },
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Photo uploaded",
      photoUrl: `/users/${updatedUser._id}/photo`,
    });
  } catch (err: any) {
    handleError(res, err);
  }
};

export const getUserPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUser = getUserOrFail(req, res);

  if (!authUser) return;

  const user = await User.findById(req.params.id);
  if (!user || !user.photo || !user.photo.data) {
    res.status(404).send("Photo not found");
    return;
  }

  res.set("Content-Type", user.photo.contentType);
  res.send(user.photo.data);
};
