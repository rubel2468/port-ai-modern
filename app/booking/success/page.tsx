"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Home } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Success header */}
        <div className="bg-gradient-to-br from-primary-600 to-teal-500 p-10 text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={52} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Booking Confirmed!</h1>
          <p className="text-white/80 mt-2">Payment successful. Enjoy your stay! 🎉</p>
        </div>

        {/* Booking ID */}
        <div className="p-8">
          {bookingId && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                Booking Reference
              </p>
              <p className="text-2xl font-black text-primary-700 tracking-widest">
                {bookingId}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                📧 Confirmation sent to your email
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
            📌 Please carry your booking ID and a valid photo ID at check-in.
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition"
            >
              <Calendar size={18} /> View My Bookings
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-gray-200 hover:border-primary-400 text-gray-700 hover:text-primary-700 rounded-2xl font-semibold transition"
            >
              <Home size={18} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
