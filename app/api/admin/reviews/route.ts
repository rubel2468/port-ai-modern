import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Hotel from "@/models/Hotel";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status === "Approved") query.isApproved = true;
    if (status === "Pending Approval") query.isApproved = false;

    const total = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .populate("user", "name email")
      .populate("hotel", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      reviews,
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
    const { reviewId, isApproved } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { isApproved }, { new: true });
    
    if (review && review.hotel) {
      // Recalculate hotel ratings
      const allHotelReviews = await Review.find({ hotel: review.hotel, isApproved: true });
      const reviewCount = allHotelReviews.length;
      const avgRating = reviewCount > 0 
        ? allHotelReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
        : 0;
        
      await Hotel.findByIdAndUpdate(review.hotel, {
        rating: Number(avgRating.toFixed(1)),
        reviewCount
      });
    }

    return NextResponse.json(review);
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
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await Review.findByIdAndDelete(reviewId);
    
    if (review && review.hotel) {
      // Recalculate hotel ratings
      const allHotelReviews = await Review.find({ hotel: review.hotel, isApproved: true });
      const reviewCount = allHotelReviews.length;
      const avgRating = reviewCount > 0 
        ? allHotelReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount 
        : 0;
        
      await Hotel.findByIdAndUpdate(review.hotel, {
        rating: Number(avgRating.toFixed(1)),
        reviewCount
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
