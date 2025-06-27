import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  passwordConfirm: string;
  rating?: number;
  experience?: number;
  location?: { lat: string; lng: string };
  bookshelf: mongoose.Types.ObjectId[];
  market: mongoose.Types.ObjectId[];
  correctPassword?: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: [true, "Please provide your name"] },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: "Passwords do not match!",
    },
  },
  rating: { type: Number, min: 0, max: 5, default: null },
  experience: { type: Number, min: 0, max: 100, default: 0 },
  location: {
    type: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
    },
    _id: false,
  },
  bookshelf: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookshelfBook" }],
  market: [{ type: mongoose.Schema.Types.ObjectId, ref: "MarketBook" }],
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
