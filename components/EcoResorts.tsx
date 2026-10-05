"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Leaf, TreePine, ArrowRight, Loader2 } from "lucide-react";

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

export default function EcoResorts() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels?type=eco_resort&limit=8&sort=rating");
        if (res.ok) {
          const data = await res.json();
          setHotels(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch eco resorts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  return (
    <section className="py-20 px-4 bg-white relative">
      {/* Subtle green tint overlay */}
      <div className="absolute inset-0 bg-green-50/30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
              🌿 Eco Resorts & Nature Retreats
            </h2>
            <p className="text-gray-500 font-medium">
              Sustainable stays surrounded by nature
            </p>
          </div>
          <Link
            href="/hotels?type=eco_resort"
            className="flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition group"
          >
            Explore All Eco Resorts
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-green-600" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {hotels.map((hotel) => (
              <Link key={hotel._id} href={`/hotels/${hotel.slug}`} className="group">
                <div className="bg-white rounded-3xl border border-green-100 shadow-sm overflow-hidden h-full flex flex-col transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={hotel.coverImage || "/placeholder-hotel.jpg"}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Leaf size={12} /> Eco Friendly
                    </div>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-sm text-gray-900">{hotel.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-green-700 font-bold text-sm">
                        ৳{(hotel.priceFrom || 0).toLocaleString()}
                      </div>
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-auto">
                      <TreePine size={14} className="text-green-600" />
                      <span className="truncate">{hotel.district || "Bangladesh"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
