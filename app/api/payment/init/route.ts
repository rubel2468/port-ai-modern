import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";

// POST /api/payment/init – initialize SSLCommerz payment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Please login to pay" }, { status: 401 });
    }

    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findOne({ bookingId }).populate("hotel");
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    const hotel = booking.hotel as any;

    // SSLCommerz payload
    const sslData = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,
      total_amount: booking.totalAmount,
      currency: "BDT",
      tran_id: booking.bookingId,
      success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
      fail_url: process.env.SSLCOMMERZ_FAIL_URL,
      cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
      ipn_url: process.env.SSLCOMMERZ_IPN_URL,

      cus_name: booking.guestInfo.name,
      cus_email: booking.guestInfo.email,
      cus_phone: booking.guestInfo.phone,
      cus_add1: booking.guestInfo.address || "N/A",
      cus_city: hotel?.location || "Sylhet",
      cus_country: "Bangladesh",

      product_name: `Hotel Booking – ${hotel?.name || "StayBD"}`,
      product_category: "Hotel",
      product_profile: "non-physical-goods",

      ship_name: booking.guestInfo.name,
      ship_add1: hotel?.address || "N/A",
      ship_city: hotel?.location || "Sylhet",
      ship_country: "Bangladesh",

      value_a: booking._id.toString(),
      value_b: booking.bookingId,
    };

    // Call SSLCommerz sandbox API
    const sslRes = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(sslData as any).toString(),
      }
    );

    const sslJson = await sslRes.json();

    if (sslJson.status !== "SUCCESS") {
      console.error("SSLCommerz init failed:", sslJson);
      return NextResponse.json(
        { error: "Payment gateway error. Please try again." },
        { status: 500 }
      );
    }

    // Save session key
    await Booking.findByIdAndUpdate(booking._id, {
      sslSession: sslJson.sessionkey,
    });

    return NextResponse.json({
      success: true,
      gatewayUrl: sslJson.GatewayPageURL,
      sessionKey: sslJson.sessionkey,
    });
  } catch (error) {
    console.error("Payment init error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
