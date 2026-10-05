import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const reviews = await Review.find({ user: token.sub }).populate({
      path: "hotel",
      select: "name slug"
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
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

    const { bookingId, rating, title, body } = await req.json();
    
    if (!bookingId || !rating || !title || !body) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await connectDB();
    
    const booking = await Booking.findOne({ _id: bookingId, user: token.sub });
    if (!booking) {
      return NextResponse.json({ success: false, message: "Booking not found or unauthorized" }, { status: 404 });
    }

    if (!['confirmed', 'completed'].includes(booking.status)) {
      return NextResponse.json({ success: false, message: "Only confirmed or completed bookings can be reviewed" }, { status: 400 });
    }

    const existingReview = await Review.findOne({ booking: bookingId, user: token.sub });
    if (existingReview) {
      return NextResponse.json({ success: false, message: "You have already reviewed this booking" }, { status: 400 });
    }

    const review = await Review.create({
      hotel: booking.hotel,
      user: token.sub,
      booking: bookingId,
      rating,
      title,
      body,
      isVerifiedStay: true
    });

    // Update hotel rating
    const hotelReviews = await Review.find({ hotel: booking.hotel });
    const avgRating = hotelReviews.reduce((acc, curr) => acc + curr.rating, 0) / hotelReviews.length;
    
    await Hotel.findByIdAndUpdate(booking.hotel, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: hotelReviews.length
    });

    return NextResponse.json({ success: true, data: review, message: "Review submitted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
