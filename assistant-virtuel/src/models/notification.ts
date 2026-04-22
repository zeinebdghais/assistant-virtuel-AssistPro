import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  type: string;
  message: string;
  content?: string;
  date: Date;
  read: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    type: { type: String, required: true },
    message: { type: String, required: true },
    content: { type: String },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
