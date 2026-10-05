"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, MapPin, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";

export default function VendorHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch("/api/vendor/hotels");
      const json = await res.json();
      if (json.success) setHotels(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Approved</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Pending Review</span>;
      case "rejected": return <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
      default: return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Properties</h1>
          <p className="text-gray-500 text-sm">Manage your hotels, resorts, and rooms.</p>
        </div>
        <Link href="/vendor/hotels/new" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition">
          <PlusCircle size={18} /> Add New Property
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm mt-8">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No properties found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven&apos;t listed any properties yet. Add your first hotel to start receiving bookings.</p>
          <Link href="/vendor/hotels/new" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold inline-block">Start Listing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image 
                  src={hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"} 
                  alt={hotel.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 shadow-md rounded-full">
                  {getStatusBadge(hotel.vendorStatus)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <MapPin size={14} /> <span className="capitalize">{hotel.district}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded-md">
                    {hotel.propertyType.replace("_", " ")}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded-md">
                    {hotel.roomCount || 0} Rooms
                  </span>
                </div>

                {hotel.vendorStatus === "pending" && (
                  <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <p>Your property is currently under review by our admin team. It will be live on the marketplace once approved.</p>
                  </div>
                )}
                
                {hotel.vendorStatus === "rejected" && (
                  <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold mb-1">Listing Rejected</p>
                      <p>{hotel.rejectionReason || "Please contact support for more details."}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <button className="flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold transition">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Need to import Building2 if not imported at top
import { Building2 } from "lucide-react";
