import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";
import { sendBookingConfirmationEmail } from "@/lib/email";

// POST /api/payment/success – SSLCommerz success callback
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tranId = formData.get("tran_id") as string;
    const valId = formData.get("val_id") as string;
    const status = formData.get("status") as string;
    const bankTranId = formData.get("bank_tran_id") as string;
    const cardType = formData.get("card_type") as string;

    if (status !== "VALID" && status !== "VALIDATED") {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=invalid`);
    }

    // Validate with SSLCommerz
    const validateRes = await fetch(
      `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}&format=json`
    );
    const validateJson = await validateRes.json();

    if (validateJson.status !== "VALID" && validateJson.status !== "VALIDATED") {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=validation`);
    }

    await connectDB();

    // Update booking
    const booking = await Booking.findOneAndUpdate(
      { bookingId: tranId },
      {
        paymentStatus: "paid",
        status: "confirmed",
        transactionId: bankTranId,
        paymentMethod: cardType,
      },
      { new: true }
    ).populate("hotel");

    if (!booking) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=notfound`);
    }

    const hotel = booking.hotel as any;

    // Send confirmation email
    sendBookingConfirmationEmail({
      customerName: booking.guestInfo.name,
      customerEmail: booking.guestInfo.email,
      hotelName: hotel?.name || "Hotel",
      location: hotel?.location || "",
      checkIn: booking.checkIn.toDateString(),
      checkOut: booking.checkOut.toDateString(),
      guests: booking.guests,
      roomType: booking.roomType,
      totalAmount: booking.totalAmount,
      bookingId: booking.bookingId,
      transactionId: bankTranId,
    }).catch(console.error);

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/booking/success?id=${booking.bookingId}`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=error`);
  }
}

// GET (browser redirect fallback)
export async function GET(req: NextRequest) {
  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/booking/failed?reason=get`);
}
