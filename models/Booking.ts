import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  user: mongoose.Types.ObjectId;
  hotel: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  roomType: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  taxes: number;
  commissionAmount: number;
  vendorEarning: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "unpaid" | "paid" | "refunded";
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    specialRequests?: string;
  };
  cancelledAt?: Date;
  cancelReason?: string;
  // TTL auto-expire unpaid pending bookings after 15 minutes
  expiresAt?: Date;
  transactionId?: string;
  paymentMethod?: string;
  sslSession?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    roomType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    vendorEarning: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    guestInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: String,
      specialRequests: String,
    },
    cancelledAt: Date,
    cancelReason: String,
    // TTL index: MongoDB will auto-delete pending+unpaid bookings after 15 min
    expiresAt: { type: Date, index: { expireAfterSeconds: 0 } },
    transactionId: String,
    paymentMethod: String,
    sslSession: String,
  },
  { timestamps: true }
);

BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ hotel: 1, checkIn: 1, checkOut: 1, status: 1 });
BookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });

const Booking = models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
