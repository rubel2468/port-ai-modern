import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";

// GET /api/vendor/dashboard
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const vendorId = (session.user as any).id;

  // Vendor's hotels
  const hotels = await Hotel.find({ owner: vendorId }).select("_id name").lean();
  const hotelIds = hotels.map((h: any) => h._id);

  // Booking stats
  const [totalBookings, pendingBookings, confirmedBookings] = await Promise.all([
    Booking.countDocuments({ hotel: { $in: hotelIds } }),
    Booking.countDocuments({ hotel: { $in: hotelIds }, status: "pending" }),
    Booking.countDocuments({ hotel: { $in: hotelIds }, status: "confirmed" }),
  ]);

  // Revenue (paid bookings)
  const revenueResult = await Booking.aggregate([
    { $match: { hotel: { $in: hotelIds }, paymentStatus: "paid" } },
    { $group: { _id: null, gross: { $sum: "$subtotal" }, commission: { $sum: "$commissionAmount" }, net: { $sum: "$vendorEarning" } } },
  ]);
  const revenue = revenueResult[0] || { gross: 0, commission: 0, net: 0 };

  // Recent bookings (last 10)
  const recentBookings = await Booking.find({ hotel: { $in: hotelIds } })
    .populate("hotel", "name")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Booking.aggregate([
    { $match: { hotel: { $in: hotelIds }, paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        bookings: { $sum: 1 },
        gross: { $sum: "$subtotal" },
        net: { $sum: "$vendorEarning" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return NextResponse.json({
    success: true,
    data: {
      hotels: hotels.length,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      revenue,
      recentBookings,
      monthlyRevenue,
    },
  });
}
