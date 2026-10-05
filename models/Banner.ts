import mongoose, { Schema, Document, models } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: "hero" | "top" | "middle" | "sidebar";
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  clickCount: number;
  createdBy: mongoose.Types.ObjectId;
  sortOrder: number;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: String,
    image: { type: String, required: true },
    link: String,
    position: {
      type: String,
      enum: ["hero", "top", "middle", "sidebar"],
      default: "middle",
    },
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
    clickCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BannerSchema.index({ position: 1, isActive: 1, sortOrder: 1 });

const Banner = models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
export default Banner;
