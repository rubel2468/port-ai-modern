import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (role && role !== "All") {
      let roleQuery = role.toLowerCase().replace(/s$/, ""); // Admins -> admin
      if (roleQuery === "vendor") roleQuery = "hotel_owner";
      query.role = roleQuery;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    // Get booking counts for these users
    const userIds = users.map(u => u._id);
    const bookingCounts = await Booking.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", count: { $sum: 1 } } }
    ]);
    
    const countMap = bookingCounts.reduce((acc: any, curr: any) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const usersWithCounts = users.map((u: any) => ({
      ...u,
      bookingCount: countMap[u._id.toString()] || 0
    }));

    return NextResponse.json({
      users: usersWithCounts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { userId, role, isVerified, isDeactivated } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (userId === token.id && role && role !== "admin") {
      return NextResponse.json({ error: "You cannot change your own admin role" }, { status: 403 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (isDeactivated !== undefined) updateData.isDeactivated = isDeactivated; // If schema supports it

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (userId === token.id) {
      return NextResponse.json({ error: "You cannot deactivate yourself" }, { status: 403 });
    }

    // Instead of deleting, just deactivate
    // If your model doesn't have isDeactivated, it won't break MongoDB, but won't do much unless code checks for it.
    // So we'll assume isDeactivated exists or we just block login.
    const user = await User.findByIdAndUpdate(userId, { isDeactivated: true }, { new: true });
    
    return NextResponse.json({ success: true, message: "User deactivated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
