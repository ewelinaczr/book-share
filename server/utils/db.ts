import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error("Missing MONGODB_URI in environment variables");
}
const MONGODB_URI: string = rawUri;

// Define a cache interface to avoid multiple connections
interface MongooseCache {
  activeConnection: typeof mongoose | null;
  pendingConnectionPromise: Promise<typeof mongoose> | null;
}

// Initialize global cache if not already present
let cached = (global as any).mongoose as MongooseCache;
if (!cached) {
  cached = (global as any).mongoose = {
    activeConnection: null,
    pendingConnectionPromise: null,
  };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.activeConnection) {
    return cached.activeConnection;
  }

  if (!cached.pendingConnectionPromise) {
    cached.pendingConnectionPromise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((conn) => {
        cached.activeConnection = conn;
        return conn;
      });
  }

  return await cached.pendingConnectionPromise;
}
