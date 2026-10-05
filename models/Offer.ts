import mongoose, { Schema, Document, models } from "mongoose";

export interface IOffer extends Document {
  hotel: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minNights: number;
  maxUsage: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableRooms: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      default: "percentage",
    },
    discountValue: { type: Number, required: true, min: 0 },
    minNights: { type: Number, default: 1 },
    maxUsage: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  },
  { timestamps: true }
);

OfferSchema.index({ hotel: 1, isActive: 1, validFrom: 1, validUntil: 1 });

const Offer = models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
export default Offer;
