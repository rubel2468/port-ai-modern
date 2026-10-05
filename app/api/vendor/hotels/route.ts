import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";

// GET /api/vendor/hotels
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const hotels = await Hotel.find({ owner: (session.user as any).id })
    .sort({ createdAt: -1 })
    .lean();

  // Attach room counts
  const hotelsWithRooms = await Promise.all(
    hotels.map(async (h: any) => {
      const roomCount = await Room.countDocuments({ hotel: h._id });
      return { ...h, roomCount };
    })
  );

  return NextResponse.json({ success: true, data: hotelsWithRooms });
}

// POST /api/vendor/hotels — create new hotel
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  // Generate slug
  const baseSlug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  const existing = await Hotel.countDocuments({ slug: new RegExp(`^${baseSlug}`) });
  const slug = existing > 0 ? `${baseSlug}-${existing}` : baseSlug;

  const hotel = await Hotel.create({
    ...body,
    slug,
    owner: (session.user as any).id,
    vendorStatus: "pending",
    isActive: false,
  });

  // Create rooms if provided
  if (body.rooms && Array.isArray(body.rooms)) {
    const roomDocs = body.rooms.map((r: any) => ({
      ...r,
      hotel: hotel._id,
      availableCount: r.totalCount,
    }));
    await Room.insertMany(roomDocs);

    // Update priceFrom
    const minPrice = Math.min(...body.rooms.map((r: any) => r.pricePerNight));
    await Hotel.findByIdAndUpdate(hotel._id, { priceFrom: minPrice });
  }

  return NextResponse.json({ success: true, hotelId: hotel._id, slug: hotel.slug }, { status: 201 });
}
