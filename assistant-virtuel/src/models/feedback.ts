import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedback extends Document {
  content: string;
  note: number;
  dateFeedback: Date;
  userId: mongoose.Types.ObjectId;
}

const feedbackSchema: Schema<IFeedback> = new Schema(
  {
    content: { type: String, required: true },
    note: { type: Number, required: true },
    dateFeedback: { type: Date, default: Date.now },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Feedback: Model<IFeedback> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;
