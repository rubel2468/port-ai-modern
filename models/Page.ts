import mongoose, { Schema, Document, models } from "mongoose";

export interface IPage extends Document {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    metaTitle: String,
    metaDescription: String,
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PageSchema.index({ slug: 1 });
PageSchema.index({ isPublished: 1 });

const Page = models.Page || mongoose.model<IPage>("Page", PageSchema);
export default Page;
