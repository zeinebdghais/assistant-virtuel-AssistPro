import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInteraction extends Document {
  contenu: string;
  dateCreation?: Date;
  employe: mongoose.Types.ObjectId;
  faq: mongoose.Types.ObjectId;
}

const InteractionSchema: Schema<IInteraction> = new Schema(
  {
    contenu: { type: String, required: true, trim: true },
    dateCreation: { type: Date, default: Date.now },
    employe: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: async function (userId: mongoose.Types.ObjectId): Promise<boolean> {
          const User = mongoose.model("User");
          const user = await User.findById(userId);
          return user && user.role === "employe";
        },
        message: "L'utilisateur associé doit être un employé.",
      },
    },
    faq: {
      type: Schema.Types.ObjectId,
      ref: "FAQ",
      required: true,
    },
  },
  { timestamps: true }
);

const Interaction: Model<IInteraction> =
  mongoose.models.Interaction || mongoose.model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
