"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, Building2, Users, CalendarDays, Wallet, Clock, Loader2, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
  if (!data) return <div>Error loading data</div>;

  const { kpi, recentBookings, recentUsers, monthlyRevenue } = data;

  const kpis = [
    { title: "Total Revenue", value: `৳${kpi.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Platform Commission", value: `৳${kpi.platformCommission.toLocaleString()}`, icon: Wallet, color: "text-primary-600", bg: "bg-primary-100" },
    { title: "Total Bookings", value: kpi.totalBookings, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Active Hotels", value: kpi.activeHotels, icon: Building2, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Registered Users", value: kpi.totalUsers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Pending Vendors", value: kpi.pendingVendors, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">System overview and key performance indicators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-amber-500 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((b: any) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium">{b.bookingId.split('-')[1]}</td>
                    <td className="px-4 py-3 font-semibold">{b.user?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{b.hotel?.name}</td>
                    <td className="px-4 py-3 font-bold">৳{b.totalAmount.toLocaleString()}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">New Registrations</h2>
            <Link href="/admin/users" className="text-sm font-bold text-amber-500 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map((u: any) => (
              <div key={u._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition">
                <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-sm text-gray-900 truncate">{u.name}</div>
                  <div className="text-xs text-gray-500 truncate">{u.email}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                    u.role === 'hotel_owner' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role === 'hotel_owner' ? 'Vendor' : 'User'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
