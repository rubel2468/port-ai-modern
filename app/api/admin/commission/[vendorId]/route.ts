import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Commission from "@/models/Commission";

// PUT /api/admin/commission/[vendorId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ vendorId: string }> }
) {
  await connectDB();
  const { rate } = await req.json();
  const { vendorId } = await params;

  if (typeof rate !== "number" || rate < 0 || rate > 100) {
    return NextResponse.json({ error: "Invalid rate" }, { status: 400 });
  }

  const commission = await Commission.findOneAndUpdate(
    { vendor: vendorId },
    { rate, type: "percentage" },
    { new: true, upsert: true }
  );

  return NextResponse.json({ success: true, data: commission });
}
