import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Promotion from "@/models/Promotion";
import Hotel from "@/models/Hotel";

// GET /api/vendor/promotions - List vendor's promotions
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const promotions = await Promotion.find({ vendor: token.sub })
      .populate("hotel", "name slug coverImage")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: promotions });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

// POST /api/vendor/promotions - Create a promotion
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hotelId, type, duration } = body;

    // Verify hotel belongs to vendor
    const hotel = await Hotel.findOne({ _id: hotelId, owner: token.sub });
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found or unauthorized" }, { status: 404 });
    }

    // Pricing based on type and duration
    const pricing: Record<string, Record<number, number>> = {
      featured: { 7: 500, 15: 900, 30: 1500 },
      premium: { 7: 1000, 15: 1800, 30: 3000 },
      homepage_banner: { 7: 2000, 15: 3500, 30: 6000 },
    };

    const amount = pricing[type]?.[duration] || 0;
    if (amount === 0) {
      return NextResponse.json({ error: "Invalid promotion type or duration" }, { status: 400 });
    }

    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    const promotion = await Promotion.create({
      hotel: hotelId,
      vendor: token.sub,
      type,
      amount,
      duration,
      startsAt,
      expiresAt,
      paymentStatus: "paid", // For now, auto-mark as paid; integrate payment later
      isActive: true,
    });

    // Update hotel flags based on promotion type
    if (type === "featured") {
      await Hotel.findByIdAndUpdate(hotelId, { isFeatured: true });
    } else if (type === "premium") {
      await Hotel.findByIdAndUpdate(hotelId, { isPremium: true });
    }

    return NextResponse.json({ success: true, data: promotion }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create promotion" }, { status: 500 });
  }
}
