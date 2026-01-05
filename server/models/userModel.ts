import mongoose, { Document, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { validateEmail } from "../../shared/validators/emailValidator";
import { validatePassword } from "../../shared/validators/passwordValidator";
import { confirmPassword } from "../../shared/validators/passwordConfirmValidator";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo?: {
    data: Buffer;
    contentType: string;
    size?: number;
    filename?: string;
  } | null;
  password?: string; // optional for Google users
  passwordConfirm?: string; // optional for Google users
  rating?: number;
  experience?: number;
  location?: { lat: string; lng: string };
  bookshelf: mongoose.Types.ObjectId[];
  market: mongoose.Types.ObjectId[];
  googleId?: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, "Please provide your name"] },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validateEmail, "Please provide a valid email"],
  },
  photo: {
    data: Buffer,
    contentType: String,
    size: Number,
    filename: String,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: [8, "Password must be at least 8 characters"],
    validate: [
      {
        validator: function (val: string) {
          return this.googleId || validatePassword(val);
        },
        message:
          "Password must be at least 8 characters and include letters and numbers",
      },
    ],
  },
  passwordConfirm: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    select: false,
    validate: {
      validator: function (this: IUser, val: string): boolean {
        return this.googleId ? true : confirmPassword(this.password!, val);
      },
      message: "Passwords do not match!",
    },
  },
  googleId: { type: String },
  rating: { type: Number, min: 0, max: 5, default: null },
  experience: { type: Number, min: 0, max: 100, default: 0 },
  location: {
    type: {
      lat: { type: String, required: false },
      lng: { type: String, required: false },
    },
    _id: false,
    required: false,
  },
  bookshelf: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookshelfBook" }],
  market: [{ type: mongoose.Schema.Types.ObjectId, ref: "MarketBook" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = "";
  next();
});

// Prevent OverwriteModelError by checking if model already exists
const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
