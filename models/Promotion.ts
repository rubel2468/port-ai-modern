import mongoose, { Schema, Document, models } from "mongoose";

export interface IPromotion extends Document {
  hotel: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  type: "featured" | "premium" | "homepage_banner";
  amount: number;
  duration: number; // days
  startsAt: Date;
  expiresAt: Date;
  paymentStatus: "pending" | "paid";
  transactionId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["featured", "premium", "homepage_banner"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    transactionId: String,
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PromotionSchema.index({ hotel: 1, type: 1, isActive: 1 });
PromotionSchema.index({ vendor: 1 });
PromotionSchema.index({ expiresAt: 1 });

const Promotion = models.Promotion || mongoose.model<IPromotion>("Promotion", PromotionSchema);
export default Promotion;
