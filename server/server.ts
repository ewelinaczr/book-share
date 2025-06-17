const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
import app from "./index";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

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
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
