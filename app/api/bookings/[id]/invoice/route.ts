import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();
    const booking = await Booking.findOne({ 
      bookingId: id,
      user: token.sub
    }).populate({
      path: "hotel",
      select: "name location address district"
    }).populate({
      path: "room",
      select: "type"
    });

    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
