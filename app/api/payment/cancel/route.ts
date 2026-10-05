import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";

// POST /api/payment/cancel – SSLCommerz cancel callback
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string;

    await connectDB();
    await Booking.findOneAndUpdate(
      { bookingId: tranId },
      { status: "cancelled", cancelReason: "Payment cancelled by user" }
    );

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/booking/failed?id=${tranId}&reason=cancelled`
    );
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=error`);
  }
}

export async function GET() {
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}`);
}
