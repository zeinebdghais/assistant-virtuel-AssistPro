// models/FAQ.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface pour le metadata
export interface IFAQMetadata {
  userId?: string;
  savedAt?: string;
  from?: string;
  unanswered?: boolean;
  [key: string]: any; // Pour d'autres champs optionnels
}

export interface IFAQ extends Document {
  question: string;
  reponse: string;
  allReponses: string[]; 
  source: "manual" | "chatbot" | "auto-generated";
  usageCount: number;
  lastUsed?: Date;
  tags?: string[];
  confidence?: number;
  isActive?: boolean;
  metadata?: IFAQMetadata; // Ajoutez cette ligne
}

const FAQSchema: Schema<IFAQ> = new Schema(
  {
    question: { 
      type: String, 
      required: true, 
      trim: true
    },
    reponse: { 
      type: String, 
      required: true, 
      trim: true 
    },
    allReponses: [{ 
      type: String,
      default: []
    }],
    source: {
      type: String,
      enum: ["manual", "chatbot", "auto-generated"],
      default: "manual"
    },
    usageCount: {
      type: Number,
      default: 0
    },
    lastUsed: {
      type: Date
    },
    tags: [{
      type: String
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: { // Ajoutez cette section
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

// Vérifier si le modèle existe déjà pour éviter les erreurs de recompilation
const FAQ: Model<IFAQ> = mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);

export default FAQ;