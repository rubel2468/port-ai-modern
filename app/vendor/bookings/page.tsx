"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VendorBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vendor/bookings?status=${filter}`);
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Confirmed</span>;
      case "pending": return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Pending</span>;
      case "cancelled": return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Cancelled</span>;
      case "completed": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Booking Management</h1>
          <p className="text-gray-500 text-sm">View and manage reservations for your properties.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by Booking ID..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary-500 text-sm w-full md:w-64" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition ${
              filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No bookings found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Booking Info</th>
                  <th className="px-6 py-4 font-bold">Guest Details</th>
                  <th className="px-6 py-4 font-bold">Dates</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-gray-100">
                          {b.hotel?.coverImage && <Image src={b.hotel.coverImage} alt="Hotel" fill className="object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{b.hotel?.name || "Hotel"}</div>
                          <div className="text-xs text-gray-500">{b.roomType} • ID: {b.bookingId.split('-')[1]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{b.guestInfo?.name}</div>
                      <div className="text-xs text-gray-500">{b.guestInfo?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{new Date(b.checkIn).toLocaleDateString("en-GB")}</div>
                      <div className="text-xs text-gray-500">to {new Date(b.checkOut).toLocaleDateString("en-GB")}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-gray-900">৳{b.subtotal.toLocaleString()}</div>
                      <div className="text-xs text-green-600 font-bold">Net: ৳{b.vendorEarning?.toLocaleString() || b.subtotal.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(b.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
