import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalAny = global as any;
if (!globalAny.mongoose) {
  globalAny.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const cached: MongooseCache = globalAny.mongoose;

  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
    return cached.conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    cached.promise = null;
    throw err;
  }
}
