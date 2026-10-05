import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hotel from "@/models/Hotel";
import Commission from "@/models/Commission";
import { sendWelcomeEmail } from "@/lib/email";

// GET /api/admin/vendors — list all vendors
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");

  const query: any = { role: "hotel_owner" };
  const vendors = await User.find(query)
    .select("name email phone createdAt isVerified")
    .sort({ createdAt: -1 })
    .lean();

  // Attach hotel counts and vendorStatus
  const enriched = await Promise.all(
    vendors.map(async (v: any) => {
      const hotels = await Hotel.find({ owner: v._id }).select("vendorStatus name").lean();
      const pendingCount = hotels.filter((h: any) => h.vendorStatus === "pending").length;
      const commission = await Commission.findOne({ vendor: v._id }).select("rate").lean();
      return {
        ...v,
        hotels,
        hotelCount: hotels.length,
        pendingHotels: pendingCount,
        commissionRate: (commission as any)?.rate ?? 10,
      };
    })
  );

  // Filter by hotel status if requested
  if (statusFilter && statusFilter !== "all") {
    const filtered = enriched.filter((v) =>
      v.hotels.some((h: any) => h.vendorStatus === statusFilter)
    );
    return NextResponse.json({ success: true, data: filtered });
  }

  return NextResponse.json({ success: true, data: enriched });
}
