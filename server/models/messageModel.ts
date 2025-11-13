import mongoose from "mongoose";

export interface IPrivateMessage extends Document {
  _id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}

const privateMessageSchema = new mongoose.Schema<IPrivateMessage>({
  _id: { type: String },
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
