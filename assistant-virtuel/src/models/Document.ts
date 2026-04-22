// import mongoose, { Schema, model, models } from "mongoose";

// const DocumentSchema = new Schema({
//   filename: String,
//   summary: String,
//   fullText: String,
//   userId: String,
//   createdAt: Date,
// });

// export default models.Document || model("Document", DocumentSchema);

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDocument extends Document {
  filename: string;
  summary: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const DocumentSchema: Schema<IDocument> = new Schema(
  {
    filename: { type: String, required: true },
    summary: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DocumentModel: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
