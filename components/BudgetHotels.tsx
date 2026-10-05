"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowRight, Loader2 } from "lucide-react";

interface Hotel {
  _id: string;
  name: string;
  slug: string;
  location: string;
  district: string;
  priceFrom: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
}

export default function BudgetHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels?category=budget&limit=8&sort=rating");
        if (res.ok) {
          const data = await res.json();
          setHotels(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch budget hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              💰 Budget-Friendly Stays
            </h2>
            <p className="text-gray-500 font-medium">
              Quality accommodation under ৳2,000/night
            </p>
          </div>
          <Link
            href="/hotels?category=budget"
            className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition group"
          >
            View All Budget Hotels
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary-600" size={48} />
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide flex gap-6 pb-4">
            {hotels.map((hotel) => (
              <Link
                key={hotel._id}
                href={`/hotels/${hotel.slug}`}
                className="min-w-[280px] w-[280px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-200">
                  <Image
                    src={hotel.coverImage || "/placeholder-hotel.jpg"}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    ৳{(hotel.priceFrom || 0).toLocaleString()}/night
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm text-gray-900">{(hotel.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-500 text-xs">({hotel.reviewCount || 0} reviews)</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-auto">
                    <MapPin size={16} />
                    <span className="truncate">{hotel.district || "Bangladesh"}</span>
                  </div>
                </div>
              </Link>
            ))}
            
            {hotels.length === 0 && !loading && (
              <div className="text-gray-500 w-full text-center py-10">
                No budget hotels found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
