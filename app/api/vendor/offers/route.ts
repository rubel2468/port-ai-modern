import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Offer from "@/models/Offer";
import Hotel from "@/models/Hotel";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const offers = await Offer.find({ vendor: token.sub })
      .populate("hotel", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("GET offers error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      hotelId,
      title,
      description,
      discountType,
      discountValue,
      minNights,
      maxUsage,
      validFrom,
      validUntil,
      applicableRooms,
    } = body;

    await connectDB();
    
    // Verify hotel belongs to vendor
    const hotel = await Hotel.findOne({ _id: hotelId, vendor: token.sub });
    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found or unauthorized" },
        { status: 404 }
      );
    }

    const offer = await Offer.create({
      hotel: hotelId,
      vendor: token.sub,
      title,
      description,
      discountType,
      discountValue,
      minNights,
      maxUsage,
      validFrom,
      validUntil,
      applicableRooms: applicableRooms || [],
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error("POST offer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { offerId, ...updateFields } = body;

    if (!offerId) {
      return NextResponse.json(
        { error: "offerId is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Verify offer belongs to vendor and update
    const offer = await Offer.findOneAndUpdate(
      { _id: offerId, vendor: token.sub },
      { $set: updateFields },
      { new: true }
    );

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error("PUT offer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || token.role !== "vendor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { offerId } = body;

    if (!offerId) {
      return NextResponse.json(
        { error: "offerId is required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Soft delete / deactivate
    const offer = await Offer.findOneAndUpdate(
      { _id: offerId, vendor: token.sub },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Offer deactivated successfully" });
  } catch (error) {
    console.error("DELETE offer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
