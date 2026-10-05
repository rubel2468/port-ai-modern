import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hotel from "@/models/Hotel";

// PUT /api/admin/hotels/[id]/verify — toggle verified, featured, premium, approve
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const allowedFields = ["isVerified", "isFeatured", "isPremium", "vendorStatus", "rejectionReason"];
  const update: Record<string, any> = {};

  for (const key of allowedFields) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  // When approving a hotel, set isActive = true
  if (body.vendorStatus === "approved") {
    update.isActive = true;
  }
  if (body.vendorStatus === "rejected") {
    update.isActive = false;
  }

  const hotel = await Hotel.findByIdAndUpdate(id, update, { new: true });
  if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: hotel });
}
