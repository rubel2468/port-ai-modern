import mongoose, { Schema, Document, models } from "mongoose";

export interface ISubscription extends Document {
  vendor: mongoose.Types.ObjectId;
  plan: "free" | "silver" | "gold" | "platinum";
  features: {
    maxHotels: number;
    commissionDiscount: number; // percentage off standard commission
    featuredSlots: number;
    prioritySupport: boolean;
    analyticsAccess: boolean;
  };
  price: number; // monthly price in BDT
  startsAt: Date;
  expiresAt: Date;
  isActive: boolean;
  autoRenew: boolean;
  paymentHistory: {
    amount: number;
    date: Date;
    transactionId?: string;
    status: "paid" | "failed";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    plan: {
      type: String,
      enum: ["free", "silver", "gold", "platinum"],
      default: "free",
    },
    features: {
      maxHotels: { type: Number, default: 2 },
      commissionDiscount: { type: Number, default: 0 },
      featuredSlots: { type: Number, default: 0 },
      prioritySupport: { type: Boolean, default: false },
      analyticsAccess: { type: Boolean, default: false },
    },
    price: { type: Number, default: 0 },
    startsAt: { type: Date, default: Date.now },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
    autoRenew: { type: Boolean, default: false },
    paymentHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        transactionId: String,
        status: { type: String, enum: ["paid", "failed"], default: "paid" },
      },
    ],
  },
  { timestamps: true }
);

SubscriptionSchema.index({ vendor: 1 });
SubscriptionSchema.index({ plan: 1, isActive: 1 });

const Subscription = models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
