"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Lock, ShieldCheck, User, Mail, Phone, MapPin, Loader2, CreditCard } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests") || "2";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialRequests: "",
  });

  // Since we don't fetch full hotel details here to save time, we just calculate approx total based on params if passed, but it's better to just submit and let backend calculate.
  // We'll let the user fill the form and submit.

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/booking/checkout?${searchParams.toString()}`);
    }
    if (session?.user) {
      setGuestInfo(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [status, session, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      setError("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create Booking
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          roomId,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          guestInfo,
        }),
      });
      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to create booking");
      }

      // 2. Init Payment
      const paymentRes = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.bookingId }),
      });
      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        throw new Error(paymentData.error || "Failed to initialize payment");
      }

      // 3. Redirect to SSLCommerz
      if (paymentData.gatewayUrl) {
        window.location.href = paymentData.gatewayUrl;
      } else {
        throw new Error("Invalid payment gateway URL");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Lock size={16} /> Complete your booking safely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-2xl flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Guest Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="name" value={guestInfo.name} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={guestInfo.email} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition text-sm" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" name="phone" value={guestInfo.phone} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="address" value={guestInfo.address} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea name="specialRequests" value={guestInfo.specialRequests} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none transition text-sm" placeholder="Any specific needs?"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-4">
                <input type="radio" checked readOnly className="w-5 h-5 text-primary-600" />
                <div>
                  <div className="font-bold">SSLCommerz Secured Payment</div>
                  <div className="text-sm text-gray-500">Pay via bKash, Nagad, Rocket, VISA, MasterCard</div>
                </div>
              </div>
              <div className="flex gap-2 opacity-60">
                <div className="bg-white border border-gray-200 px-3 py-1 rounded shadow-sm text-xs font-bold text-pink-600">bKash</div>
                <div className="bg-white border border-gray-200 px-3 py-1 rounded shadow-sm text-xs font-bold text-orange-600">Nagad</div>
                <div className="bg-white border border-gray-200 px-3 py-1 rounded shadow-sm text-xs font-bold text-purple-600">Rocket</div>
                <div className="bg-white border border-gray-200 px-3 py-1 rounded shadow-sm text-xs font-bold text-blue-800 flex items-center"><CreditCard size={12} className="mr-1"/> Cards</div>
              </div>
            </div>

          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl sticky top-28">
              <h3 className="text-xl font-bold mb-6">Booking Details</h3>
              
              <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-in</span>
                  <span className="font-semibold">{checkIn ? new Date(checkIn).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-out</span>
                  <span className="font-semibold">{checkOut ? new Date(checkOut).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Guests</span>
                  <span className="font-semibold">{guests} Person(s)</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-xl font-bold text-lg transition flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="animate-spin" size={20}/> Processing...</> : "Proceed to Payment"}
              </button>

              <div className="mt-6 flex flex-col gap-2 text-xs text-gray-400 text-center">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-green-400" />
                  <span>256-bit SSL encryption</span>
                </div>
                <p>Your booking is reserved for 15 minutes after proceeding to payment.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={48} /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
