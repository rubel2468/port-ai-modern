import mongoose, { Schema, Document, models } from "mongoose";

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

NewsletterSchema.index({ email: 1 });

const Newsletter = models.Newsletter || mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

export default Newsletter;
