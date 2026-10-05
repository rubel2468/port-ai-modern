import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import Room from "@/models/Room";

// GET /api/hotels?district=&type=&category=&minPrice=&maxPrice=&amenities=&search=&page=&limit=
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const district    = searchParams.get("district");
    const type        = searchParams.get("type");
    const category    = searchParams.get("category");
    const minPrice    = searchParams.get("minPrice");
    const maxPrice    = searchParams.get("maxPrice");
    const amenities   = searchParams.get("amenities"); // comma-separated
    const featured    = searchParams.get("featured");
    const search      = searchParams.get("search");
    const sortBy      = searchParams.get("sort") || "featured"; // featured | price_asc | price_desc | rating
    const page        = parseInt(searchParams.get("page") || "1");
    const limit       = parseInt(searchParams.get("limit") || "12");
    
    // New Advanced Filters
    const hasAC             = searchParams.get("hasAC");
    const hasPool           = searchParams.get("hasPool");
    const hasFreeBreakfast  = searchParams.get("hasFreeBreakfast");
    const hasFreeWiFi       = searchParams.get("hasFreeWiFi");
    const hasParking        = searchParams.get("hasParking");
    const isPetFriendly     = searchParams.get("isPetFriendly");
    const isCouplesFriendly = searchParams.get("isCouplesFriendly");
    const isFamilyFriendly  = searchParams.get("isFamilyFriendly");
    const hasNatureView     = searchParams.get("hasNatureView");
    const guests            = searchParams.get("guests");

    const query: Record<string, any> = {
      isActive: true,
      vendorStatus: "approved",
    };

    if (district)  query.district      = district;
    if (type)      query.propertyType  = type;
    if (category)  query.category      = category;
    if (featured === "true") query.isFeatured = true;
    if (amenities) query.amenities     = { $all: amenities.split(",") };
    if (minPrice || maxPrice) {
      query.priceFrom = {};
      if (minPrice) query.priceFrom.$gte = Number(minPrice);
      if (maxPrice) query.priceFrom.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    if (hasAC === "true") query.hasAC = true;
    if (hasPool === "true") query.hasPool = true;
    if (hasFreeBreakfast === "true") query.hasFreeBreakfast = true;
    if (hasFreeWiFi === "true") query.hasFreeWiFi = true;
    if (hasParking === "true") query.hasParking = true;
    if (isPetFriendly === "true") query.isPetFriendly = true;
    if (isCouplesFriendly === "true") query.isCouplesFriendly = true;
    if (isFamilyFriendly === "true") query.isFamilyFriendly = true;
    if (hasNatureView === "true") query.hasNatureView = true;

    // Filter by guests (simplified approach: if guests specified, we find hotels with rooms matching)
    if (guests) {
      const roomMatches = await Room.find({ maxGuests: { $gte: Number(guests) } }).select("hotelId").lean();
      const hotelIds = roomMatches.map(r => r.hotelId);
      query._id = { $in: hotelIds };
    }

    // Sort
    let sort: Record<string, any> = { isFeatured: -1, rating: -1 };
    if (sortBy === "price_asc")  sort = { priceFrom: 1 };
    if (sortBy === "price_desc") sort = { priceFrom: -1 };
    if (sortBy === "rating")     sort = { rating: -1 };
    if (sortBy === "newest")     sort = { createdAt: -1 };
    if (sortBy === "bookings")   sort = { totalBookings: -1 };

    const skip  = (page - 1) * limit;
    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("name slug coverImage location district propertyType category rating reviewCount priceFrom isFeatured isPremium isVerified amenities tags hasAC hasPool hasFreeBreakfast hasFreeWiFi hasParking isPetFriendly isCouplesFriendly isFamilyFriendly hasNatureView")
      .lean();

    return NextResponse.json({
      success: true,
      data: hotels,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}
