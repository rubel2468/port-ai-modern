import mongoose, { Schema, Document, models } from "mongoose";

export interface IRoom extends Document {
  hotel: mongoose.Types.ObjectId;
  type: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  totalCount: number;
  availableCount: number;
  amenities: string[];
  images: string[];
  size?: number; // sqft
  bedType?: string;
  isActive: boolean;
  // Optimistic locking handled by mongoose __v
}

const RoomSchema = new Schema<IRoom>(
  {
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, default: 2 },
    totalCount: { type: Number, required: true, min: 1 },
    availableCount: { type: Number, required: true, min: 0 },
    amenities: [String],
    images: [String],
    size: Number,
    bedType: { type: String, default: "Double" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, optimisticConcurrency: true }
);

RoomSchema.index({ hotel: 1, type: 1 });

const Room = models.Room || mongoose.model<IRoom>("Room", RoomSchema);
export default Room;
