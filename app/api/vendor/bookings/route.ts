import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";

// GET /api/vendor/bookings
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const hotels = await Hotel.find({ owner: (session.user as any).id }).select("_id").lean();
  const hotelIds = hotels.map((h: any) => h._id);

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const query: any = { hotel: { $in: hotelIds } };
  if (statusFilter && statusFilter !== "all") query.status = statusFilter;

  const bookings = await Booking.find(query)
    .populate("hotel", "name coverImage")
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, data: bookings });
}
