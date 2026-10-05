import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hotel from "@/models/Hotel";
import Booking from "@/models/Booking";
import Commission from "@/models/Commission";
import Review from "@/models/Review";

// GET /api/admin/dashboard
export async function GET(req: NextRequest) {
  await connectDB();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalVendors,
    pendingVendors,
    totalHotels,
    activeHotels,
    totalBookings,
    confirmedBookings,
  ] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "hotel_owner" }),
    Hotel.countDocuments({ vendorStatus: "pending" }),
    Hotel.countDocuments(),
    Hotel.countDocuments({ isActive: true, vendorStatus: "approved" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "confirmed" }),
  ]);

  // Revenue
  const revenueAgg = await Booking.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" }, commission: { $sum: "$commissionAmount" } } },
  ]);
  const revenue = revenueAgg[0] || { total: 0, commission: 0 };

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Booking.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        bookings: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        commission: { $sum: "$commissionAmount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Recent 10 bookings
  const recentBookings = await Booking.find()
    .populate("hotel", "name")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Recent 5 users
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email role createdAt")
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      kpi: {
        totalUsers,
        totalVendors,
        pendingVendors,
        totalHotels,
        activeHotels,
        totalBookings,
        confirmedBookings,
        totalRevenue: revenue.total,
        platformCommission: revenue.commission,
      },
      monthlyRevenue,
      recentBookings,
      recentUsers,
    },
  });
}
