"use client";
import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, MapPin, Building2, Users, DollarSign, Loader2, PieChart, ArrowUpRight, ArrowDownRight, Percent } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!data) return <div>Failed to load analytics</div>;

  const maxRevenue = Math.max(...data.revenueByMonth.map((d: any) => d.revenue), 1);
  const maxUserGrowth = Math.max(...data.userGrowth.map((d: any) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-primary-600" />
            Analytics & Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">Platform performance and business insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(data.kpis.totalRevenue)}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Percent size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Platform Commission</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(data.kpis.totalCommission)}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{data.kpis.totalBookings}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Avg. Booking Value</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(data.kpis.avgBookingValue)}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Cancellation Rate</p>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{data.kpis.cancellationRate.toFixed(1)}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-600" /> Revenue Trend (Last 12 Months)
          </h3>
          <div className="h-64 flex items-end gap-2 sm:gap-4">
            {data.revenueByMonth.map((item: any, i: number) => {
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="w-full bg-primary-100 rounded-t-lg relative" style={{ height: `${Math.max(height, 5)}%` }}>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-primary-500 rounded-t-lg transition-all duration-500" style={{ height: '100%' }}></div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users size={18} className="text-blue-500" /> New Users (Last 6 Months)
          </h3>
          <div className="h-64 flex items-end gap-3">
            {data.userGrowth.map((item: any, i: number) => {
              const height = (item.count / maxUserGrowth) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="w-full bg-blue-100 rounded-t-lg relative" style={{ height: `${Math.max(height, 5)}%` }}>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                      {item.count} Users
                    </div>
                    <div className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500" style={{ height: '100%' }}></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Hotels */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 size={18} className="text-amber-500" /> Top Performing Properties
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                  <th className="pb-3 font-semibold">Property</th>
                  <th className="pb-3 font-semibold text-center">Bookings</th>
                  <th className="pb-3 font-semibold text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topHotels.map((hotel: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-sm text-gray-900">{hotel.name}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold">{hotel.bookings}</span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className="font-bold text-primary-600">{formatCurrency(hotel.revenue)}</span>
                    </td>
                  </tr>
                ))}
                {data.topHotels.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">No property data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Property Type Dist */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-purple-500" /> Property Types
          </h3>
          <div className="space-y-4">
            {data.typeDist.map((type: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    i === 0 ? 'bg-primary-500' : 
                    i === 1 ? 'bg-amber-500' : 
                    i === 2 ? 'bg-blue-500' : 
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{type.name.replace('_', ' ')}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{type.count}</span>
              </div>
            ))}
            {data.typeDist.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">No property type data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
