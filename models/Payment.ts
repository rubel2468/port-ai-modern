import mongoose, { Schema, Document, models } from "mongoose";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  bookingId: string;
  amount: number;
  currency: string;
  method: string; // bKash, Nagad, VISA etc.
  transactionId: string;
  sslValId?: string;
  sslSessionKey?: string;
  status: "pending" | "success" | "failed" | "refunded";
  gatewayResponse?: object;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookingId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    method: String,
    transactionId: { type: String, unique: true, sparse: true },
    sslValId: String,
    sslSessionKey: String,
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    gatewayResponse: Schema.Types.Mixed,
    refundedAt: Date,
    refundReason: String,
  },
  { timestamps: true }
);

PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ user: 1, status: 1 });

const Payment = models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
