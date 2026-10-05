import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hotel from "@/models/Hotel";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(token.sub).populate({
      path: "wishlist",
      model: Hotel,
      select: "name slug coverImage location district rating priceFrom propertyType"
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.wishlist });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { hotelId } = await req.json();
    if (!hotelId) {
      return NextResponse.json({ success: false, message: "Hotel ID is required" }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(token.sub, {
      $addToSet: { wishlist: hotelId }
    });

    return NextResponse.json({ success: true, message: "Added to wishlist" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { hotelId } = await req.json();
    if (!hotelId) {
      return NextResponse.json({ success: false, message: "Hotel ID is required" }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(token.sub, {
      $pull: { wishlist: hotelId }
    });

    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
