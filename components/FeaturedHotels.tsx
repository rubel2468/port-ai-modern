"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star, MapPin, Heart, Wifi, Car, Coffee,
  Waves, ChevronRight, BadgeCheck, TrendingUp, Loader2
} from "lucide-react";

const filters = ["All", "Hotel", "Resort", "Eco Resort", "Cottage"];

function HotelCard({ hotel }: { hotel: any }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 card-hover group">
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <img
          src={hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {hotel.isFeatured && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-gray-900`}>
              Featured
            </span>
          )}
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
        >
          <Heart size={16} className={liked ? "text-red-500 fill-red-500" : "text-gray-600"} />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full capitalize">
          {hotel.propertyType?.replace("_", " ")}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight flex-1">
            {hotel.name}
          </h3>
          {hotel.isVerified && (
            <BadgeCheck size={18} className="text-primary-600 shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={13} className="text-primary-500" />
          {hotel.location?.city || hotel.district || "Bangladesh"}
        </div>

        <div className="flex items-center gap-2 mb-4">
          {hotel.hasWifi && <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"><Wifi size={13} className="text-gray-600" /></div>}
          {hotel.hasParking && <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"><Car size={13} className="text-gray-600" /></div>}
          {hotel.hasPool && <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center"><Waves size={13} className="text-gray-600" /></div>}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700">{hotel.rating?.toFixed(1) || "New"}</span>
            </div>
            <span className="text-xs text-gray-500">({hotel.reviewCount || 0})</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary-700">৳{hotel.priceFrom?.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">/night</p>
          </div>
        </div>

        <Link 
          href={`/hotels/${hotel.slug}`} 
          className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-bold transition group/btn flex items-center justify-center gap-2"
        >
          Book Now
          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedHotels() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hotels?featured=true&limit=9")
      .then(res => res.json())
      .then(data => {
        setHotels(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered =
    activeFilter === "All"
      ? hotels
      : hotels.filter((h) => h.propertyType?.replace("_", " ").toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-20 px-4 bg-gray-50" id="hotels">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-primary-600 rounded-full" />
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Featured Properties
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Top-Rated Hotels & Resorts
            </h2>
            <p className="text-gray-500 mt-2">
              Handpicked properties loved by our guests
            </p>
          </div>
          <Link href="/hotels" className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition shrink-0">
            View All Properties <ChevronRight size={18} />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${
                activeFilter === f
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary-600" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No properties found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
