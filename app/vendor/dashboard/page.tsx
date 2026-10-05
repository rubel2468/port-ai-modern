"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Building2, CalendarDays, Clock, PlusCircle, ArrowRight, Loader2 } from "lucide-react";

export default function VendorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/vendor/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  if (!data) return <div>Failed to load data</div>;

  const kpis = [
    { title: "Net Revenue", value: `৳${data.revenue.net.toLocaleString()}`, icon: Wallet, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Bookings", value: data.totalBookings, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Pending Bookings", value: data.pendingBookings, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "My Hotels", value: data.hotels, icon: Building2, color: "text-primary-600", bg: "bg-primary-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here&apos;s what&apos;s happening with your properties.</p>
        </div>
        <Link href="/vendor/hotels/new" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition">
          <PlusCircle size={18} /> Add New Hotel
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <Link href="/vendor/bookings" className="text-sm font-bold text-primary-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No bookings yet</td></tr>
                ) : (
                  data.recentBookings.map((b: any) => (
                    <tr key={b._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{b.bookingId.split('-')[1]}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{b.hotel?.name}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(b.checkIn).toLocaleDateString("en-GB", {day:"numeric",month:"short"})} - {new Date(b.checkOut).toLocaleDateString("en-GB", {day:"numeric",month:"short"})}
                      </td>
                      <td className="px-4 py-3 font-bold">৳{b.subtotal.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Revenue Chart (CSS based) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-6">Revenue Chart (Last 6 Months)</h2>
          {data.monthlyRevenue.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No revenue data yet</div>
          ) : (
            <div className="flex items-end justify-between h-48 gap-2">
              {data.monthlyRevenue.map((m: any, i: number) => {
                const max = Math.max(...data.monthlyRevenue.map((d: any) => d.net));
                const height = max > 0 ? (m.net / max) * 100 : 0;
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (
                  <div key={i} className="flex flex-col items-center gap-2 group flex-1">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs py-1 px-2 rounded font-bold transition whitespace-nowrap z-10 pointer-events-none">
                        ৳{m.net.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <div 
                        className="w-full max-w-[40px] bg-primary-200 group-hover:bg-primary-500 rounded-t-md transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{monthNames[m._id.month - 1]}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/vendor/earnings" className="text-sm font-bold text-primary-600 hover:underline flex items-center justify-center gap-1">
              View Detailed Earnings <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
