import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    // 1. Total revenue and commission
    const allBookings = await Booking.find({ status: { $in: ["confirmed", "completed"] } });
    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalCommission = allBookings.reduce((sum, b) => sum + (b.commissionAmount || 0), 0);
    const totalBookings = await Booking.countDocuments();
    
    // Average booking value
    const avgBookingValue = allBookings.length > 0 ? totalRevenue / allBookings.length : 0;
    
    // Cancellation rate
    const cancelledCount = await Booking.countDocuments({ status: "cancelled" });
    const cancellationRate = totalBookings > 0 ? (cancelledCount / totalBookings) * 100 : 0;

    // 2. Monthly Revenue (Last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyBookings = await Booking.aggregate([
      { 
        $match: { 
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: twelveMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          commission: { $sum: "$commissionAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currentMonth = new Date(twelveMonthsAgo);
    const revenueByMonth = [];

    for (let i = 0; i < 12; i++) {
      const monthNum = currentMonth.getMonth() + 1;
      const yearNum = currentMonth.getFullYear();
      
      const data = monthlyBookings.find(m => m._id.month === monthNum && m._id.year === yearNum);
      
      revenueByMonth.push({
        month: `${months[monthNum - 1]} ${yearNum.toString().slice(2)}`,
        revenue: data ? data.revenue : 0,
        commission: data ? data.commission : 0
      });
      
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // 3. Top 5 Hotels
    const topHotels = await Booking.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $group: { _id: "$hotel", revenue: { $sum: "$totalAmount" }, bookings: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "hotels", localField: "_id", foreignField: "_id", as: "hotelDoc" } },
      { $unwind: "$hotelDoc" },
      { $project: { name: "$hotelDoc.name", slug: "$hotelDoc.slug", revenue: 1, bookings: 1 } }
    ]);

    // 4. District Distribution
    const districtDist = await Hotel.aggregate([
      { $group: { _id: "$location.district", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 5. Property Type Distribution
    const typeDist = await Hotel.aggregate([
      { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // 6. User Growth (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const userGrowthRaw = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    let currentGrowMonth = new Date(sixMonthsAgo);
    const userGrowth = [];
    
    for (let i = 0; i < 6; i++) {
      const monthNum = currentGrowMonth.getMonth() + 1;
      const yearNum = currentGrowMonth.getFullYear();
      
      const data = userGrowthRaw.find(m => m._id.month === monthNum && m._id.year === yearNum);
      
      userGrowth.push({
        month: `${months[monthNum - 1]}`,
        count: data ? data.count : 0
      });
      
      currentGrowMonth.setMonth(currentGrowMonth.getMonth() + 1);
    }

    return NextResponse.json({
      kpis: {
        totalRevenue,
        totalCommission,
        totalBookings,
        avgBookingValue,
        cancellationRate
      },
      revenueByMonth,
      topHotels,
      districtDist: districtDist.map(d => ({ name: d._id || "Unknown", count: d.count })),
      typeDist: typeDist.map(t => ({ name: t._id, count: t.count })),
      userGrowth
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
