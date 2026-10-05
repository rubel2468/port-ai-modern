import mongoose, { Schema, Document, models } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  photos: string[];
  isVerifiedStay: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    body: { type: String, required: true, trim: true },
    photos: [String],
    isVerifiedStay: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ hotel: 1, isApproved: 1 });

const Review = models.Review || mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
