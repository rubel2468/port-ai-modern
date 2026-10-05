import mongoose, { Schema, Document, models } from "mongoose";

export interface IHotel extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  owner: mongoose.Types.ObjectId;
  vendorStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  isVerified: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  isActive: boolean;

  // Location
  location: string;
  district: "sylhet" | "sreemangal" | "moulvibazar" | "sunamganj" | "habiganj" | "other";
  address: string;
  latitude?: number;
  longitude?: number;

  // Property details
  propertyType: "hotel" | "resort" | "cottage" | "eco_resort";
  category: "luxury" | "standard" | "budget";
  starRating?: number; // 1-5

  // Media
  coverImage?: string;
  images: string[];

  // Details
  amenities: string[];
  tags: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  rules: string[];
  nearbyAttractions: string[];

  // Aggregated stats
  rating: number;
  reviewCount: number;
  totalBookings: number;
  priceFrom: number; // minimum room price (denormalized for listing)

  // Commission for this hotel (admin override)
  commissionOverride?: number;

  // Additional Amenities
  hasAC: boolean;
  hasPool: boolean;
  hasFreeBreakfast: boolean;
  hasFreeWiFi: boolean;
  hasParking: boolean;
  isPetFriendly: boolean;
  isCouplesFriendly: boolean;
  isFamilyFriendly: boolean;
  hasNatureView: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: String,
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    rejectionReason: String,
    isVerified: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // active only after approval

    location: { type: String, required: true },
    district: {
      type: String,
      required: true,
      enum: ["sylhet", "sreemangal", "moulvibazar", "sunamganj", "habiganj", "other"],
    },
    address: String,
    latitude: Number,
    longitude: Number,

    propertyType: {
      type: String,
      enum: ["hotel", "resort", "cottage", "eco_resort"],
      required: true,
    },
    category: {
      type: String,
      enum: ["luxury", "standard", "budget"],
      default: "standard",
    },
    starRating: { type: Number, min: 1, max: 5 },

    coverImage: String,
    images: [String],

    amenities: [String],
    tags: [String],
    checkInTime: { type: String, default: "12:00" },
    checkOutTime: { type: String, default: "11:00" },
    cancellationPolicy: {
      type: String,
      default: "Free cancellation up to 24 hours before check-in.",
    },
    rules: [String],
    nearbyAttractions: [String],

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    priceFrom: { type: Number, default: 0 },

    commissionOverride: Number,

    hasAC: { type: Boolean, default: false },
    hasPool: { type: Boolean, default: false },
    hasFreeBreakfast: { type: Boolean, default: false },
    hasFreeWiFi: { type: Boolean, default: false },
    hasParking: { type: Boolean, default: false },
    isPetFriendly: { type: Boolean, default: false },
    isCouplesFriendly: { type: Boolean, default: false },
    isFamilyFriendly: { type: Boolean, default: false },
    hasNatureView: { type: Boolean, default: false },
  },
  { timestamps: true }
);

HotelSchema.index({ district: 1, propertyType: 1, category: 1, priceFrom: 1 });
HotelSchema.index({ vendorStatus: 1, isActive: 1, isFeatured: -1, rating: -1 });
HotelSchema.index({ name: "text", description: "text", location: "text" });

const Hotel = models.Hotel || mongoose.model<IHotel>("Hotel", HotelSchema);
export default Hotel;
