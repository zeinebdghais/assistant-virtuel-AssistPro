// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  nom: string;
  prenom: string;
  username: string;
  email: string;
  password: string;
  numTelephone: string;
  poste: string;
  salaire: number;
  dateEmbauche?: Date;
  role: "employe" | "admin";
}

const UserSchema: Schema<IUser> = new Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    numTelephone: { type: String, required: true },
    poste: { type: String, required: true },
    salaire: { type: Number, required: true },
    dateEmbauche: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ["employe", "admin"],
      default: "employe",
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
