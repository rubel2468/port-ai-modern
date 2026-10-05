"use client";
import { useState, useEffect } from "react";
import { Wallet, TrendingUp, DollarSign, Download, Loader2 } from "lucide-react";

export default function VendorEarnings() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  if (!data) return <div>Error loading data</div>;

  const rev = data.revenue;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Earnings & Payouts</h1>
          <p className="text-gray-500 text-sm">Track your revenue, commissions, and upcoming payouts.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition">
          <Download size={18} /> Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Gross Revenue</p>
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><DollarSign size={16}/></div>
          </div>
          <h3 className="text-3xl font-black text-gray-900">৳{rev.gross.toLocaleString()}</h3>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Platform Commission</p>
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center"><TrendingUp size={16}/></div>
          </div>
          <h3 className="text-3xl font-black text-red-600">-৳{rev.commission.toLocaleString()}</h3>
        </div>
        <div className="bg-primary-700 rounded-3xl p-6 shadow-xl shadow-primary-700/20 text-white flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={80}/></div>
          <div className="relative z-10">
            <p className="text-primary-100 font-bold uppercase text-xs tracking-wider mb-2">Net Earnings</p>
            <h3 className="text-3xl font-black">৳{rev.net.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
        <span className="text-lg">💡</span> Platform commission is automatically deducted from online payments.
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">Monthly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Month</th>
                <th className="px-6 py-4 font-bold">Bookings</th>
                <th className="px-6 py-4 font-bold">Gross Revenue</th>
                <th className="px-6 py-4 font-bold">Net Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.monthlyRevenue.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-500">No data available</td></tr>
              ) : (
                data.monthlyRevenue.map((m: any, i: number) => {
                  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{monthNames[m._id.month - 1]} {m._id.year}</td>
                      <td className="px-6 py-4 text-gray-600">{m.bookings}</td>
                      <td className="px-6 py-4 text-gray-600">৳{m.gross.toLocaleString()}</td>
                      <td className="px-6 py-4 font-bold text-green-600">৳{m.net.toLocaleString()}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
