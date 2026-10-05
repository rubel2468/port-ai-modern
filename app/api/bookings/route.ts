import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Hotel from "@/models/Hotel";
import Commission from "@/models/Commission";
import { sendBookingConfirmationEmail } from "@/lib/email";

function generateBookingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `SBD-${rand}-${Date.now().toString(36).toUpperCase()}`;
}

// ── POST /api/bookings ── Create booking (atomic room availability check)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Please login to book" }, { status: 401 });
  }

  const { hotelId, roomId, checkIn, checkOut, guests, guestInfo } = await req.json();

  if (!hotelId || !roomId || !checkIn || !checkOut || !guestInfo) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    await connectDB();

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86_400_000);
    if (nights < 1) throw new Error("Invalid dates");

    // ── ATOMIC: decrement availableCount only if > 0 ─────────────────────
    const room = await Room.findOneAndUpdate(
      { _id: roomId, hotel: hotelId, availableCount: { $gt: 0 }, isActive: true },
      { $inc: { availableCount: -1 } },
      { new: true, session: dbSession }
    );

    if (!room) {
      await dbSession.abortTransaction();
      return NextResponse.json({ error: "Room not available. Please choose another." }, { status: 409 });
    }

    const hotel = await Hotel.findById(hotelId).session(dbSession);
    if (!hotel) throw new Error("Hotel not found");

    // Commission
    const commissionDoc = await Commission.findOne({ vendor: hotel.owner }).session(dbSession);
    const commissionRate = hotel.commissionOverride ?? commissionDoc?.rate ?? 10;

    const pricePerNight   = room.pricePerNight;
    const subtotal        = pricePerNight * nights;
    const taxes           = Math.round(subtotal * 0.07);
    const totalAmount     = subtotal + taxes;
    const commissionAmt   = Math.round(subtotal * (commissionRate / 100));
    const vendorEarning   = subtotal - commissionAmt;
    const bookingId       = generateBookingId();

    // Booking expires in 15 minutes if not paid
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const [booking] = await Booking.create(
      [
        {
          bookingId,
          user: (session.user as any).id,
          hotel: hotelId,
          room: roomId,
          roomType: room.type,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          nights,
          pricePerNight,
          subtotal,
          taxes,
          commissionAmount: commissionAmt,
          vendorEarning,
          totalAmount,
          status: "pending",
          paymentStatus: "unpaid",
          guestInfo,
          expiresAt,
        },
      ],
      { session: dbSession }
    );

    await dbSession.commitTransaction();

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      bookingDbId: booking._id,
      totalAmount,
      nights,
      expiresAt,
    });
  } catch (err: any) {
    await dbSession.abortTransaction();
    console.error("Booking error:", err);
    return NextResponse.json({ error: err.message || "Booking failed" }, { status: 500 });
  } finally {
    dbSession.endSession();
  }
}

// ── GET /api/bookings ── Customer's own bookings
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const bookings = await Booking.find({ user: (session.user as any).id })
    .populate("hotel", "name coverImage location district")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, data: bookings });
}
