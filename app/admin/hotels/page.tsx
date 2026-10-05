"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Shield, Award, Loader2 } from "lucide-react";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hotels?limit=50");
      const json = await res.json();
      if (json.success) setHotels(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, field: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/hotels/${id}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue })
      });
      const json = await res.json();
      if (json.success) {
        setHotels(hotels.map(h => h._id === id ? { ...h, [field]: !currentValue } : h));
      }
    } catch (err) {
      alert("Failed to update");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Hotel Verification</h1>
        <p className="text-gray-500 text-sm">Manage hotel badges, verified status, and featured listings.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Property</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold">Verified</th>
                <th className="px-6 py-4 font-bold">Featured</th>
                <th className="px-6 py-4 font-bold">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotels.map((h) => (
                <tr key={h._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                        {h.coverImage && <Image src={h.coverImage} alt={h.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{h.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{h.propertyType.replace("_", " ")}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {h.location}, {h.district}
                  </td>
                  
                  {/* Verified Toggle */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(h._id, 'isVerified', h.isVerified)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      <Shield size={14} /> {h.isVerified ? 'Verified' : 'Verify'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(h._id, 'isFeatured', h.isFeatured)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      <Star size={14} className={h.isFeatured ? 'fill-amber-700' : ''} /> {h.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  </td>

                  {/* Premium Toggle */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(h._id, 'isPremium', h.isPremium)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${h.isPremium ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      <Award size={14} /> {h.isPremium ? 'Premium' : 'Make Premium'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
