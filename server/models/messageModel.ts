import mongoose from "mongoose";
import { Message } from "@interfaces/Message";

const privateMessageSchema = new mongoose.Schema<Message>({
  from: { type: String, required: true },
  to: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const PrivateMessage = mongoose.model(
  "PrivateMessage",
  privateMessageSchema
);

export default mongoose.models.PrivateMessage ||
  mongoose.model("PrivateMessage", privateMessageSchema);
