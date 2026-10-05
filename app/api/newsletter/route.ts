import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: "Already subscribed" }, { status: 400 });
      } else {
        existing.isActive = true;
        await existing.save();
        return NextResponse.json({ message: "Successfully reactivated subscription" }, { status: 200 });
      }
    }

    await Newsletter.create({ email });
    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 });

  } catch (error: any) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || token.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Newsletter.countDocuments();

    return NextResponse.json({
      subscribers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error("Newsletter API GET error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
