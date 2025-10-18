import mongoose from "mongoose";

// Load MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

// Safety check: throw an error if the URI is missing
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

// Global cache to persist connection across hot reloads (important for dev mode)
let cached = (global as any).mongoose;

if (!cached) {
  // Initialize cache structure if it doesn't exist
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using Mongoose.
 * Caches the connection to avoid reinitializing on every request.
 */
export async function connectToDatabase() {
  // Return existing connection if available
  if (cached.conn) return cached.conn;

  // If no connection promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // Prevents Mongoose from queuing operations before connection
      })
      .then((mongoose) => {
        console.log("MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  // Await the connection promise and cache the result
  cached.conn = await cached.promise;
  return cached.conn;
}
