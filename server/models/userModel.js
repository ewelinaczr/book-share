const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
      validator: function (el) {
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
  },
  bookshelf: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookshelfBook" }],
  market: [{ type: mongoose.Schema.Types.ObjectId, ref: "MarketBook" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 12);
  // Remove passwordConfirm after hashing
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
