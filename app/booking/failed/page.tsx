"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCcw, Home } from "lucide-react";

const reasonMessages: Record<string, string> = {
  failed: "Your payment was declined. Please try again with a different method.",
  cancelled: "You cancelled the payment. Your booking is not confirmed.",
  invalid: "Payment validation failed. Please contact support.",
  validation: "We could not verify your payment. Please contact support.",
  notfound: "Booking not found. Please try again.",
  error: "An unexpected error occurred. Please contact support.",
  get: "Invalid payment session.",
};

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "error";
  const bookingId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 p-10 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={52} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Payment Failed</h1>
          <p className="text-white/80 mt-2">
            {reasonMessages[reason] || "Something went wrong."}
          </p>
        </div>

        <div className="p-8">
          {bookingId && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center mb-6">
              <p className="text-xs text-gray-500">Booking Reference</p>
              <p className="font-bold text-gray-800 mt-1">{bookingId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold transition"
            >
              <RefreshCcw size={18} /> Try Again
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold transition hover:border-gray-300"
            >
              <Home size={18} /> Back to Home
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need help?{" "}
            <a href="mailto:support@staybd.com" className="text-primary-600 font-semibold">
              support@staybd.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BookingFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-rose-50 flex items-center justify-center">Loading...</div>}>
      <FailedContent />
    </Suspense>
  );
}
