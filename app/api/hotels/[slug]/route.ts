import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";
import Review from "@/models/Review";

// GET /api/hotels/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const hotel = await Hotel.findOne({
      slug,
      isActive: true,
      vendorStatus: "approved",
    })
      .populate("owner", "name email")
      .lean();

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // Fetch rooms
    const rooms = await Room.find({
      hotel: (hotel as any)._id,
      isActive: true,
    }).lean();

    // Fetch reviews
    const reviews = await Review.find({
      hotel: (hotel as any)._id,
      isApproved: true,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: { ...hotel, rooms, reviews },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 });
  }
}
