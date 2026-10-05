import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

// PUT /api/bookings/[id]/cancel
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;

  const booking = await Booking.findOne({
    bookingId: id,
    user: (session.user as any).id,
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status === "cancelled") return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  if (booking.status === "completed") return NextResponse.json({ error: "Cannot cancel completed booking" }, { status: 400 });

  const { reason } = await req.json().catch(() => ({ reason: "Customer requested cancellation" }));

  // Return room availability
  await Room.findByIdAndUpdate(booking.room, { $inc: { availableCount: 1 } });

  booking.status      = "cancelled";
  booking.cancelledAt = new Date();
  booking.cancelReason = reason || "Customer requested cancellation";
  await booking.save();

  return NextResponse.json({ success: true, message: "Booking cancelled" });
}
