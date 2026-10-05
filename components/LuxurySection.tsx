"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ChevronRight, Crown, Sparkles, Loader2 } from "lucide-react";

export default function LuxurySection() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hotels?category=premium&limit=2&sort=rating")
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

  return (
    <section className="py-20 px-4 bg-white" id="resorts">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full mb-4">
            <Crown size={15} className="text-amber-500" />
            <span className="text-amber-700 font-semibold text-sm">Luxury Collection</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-2">
            Extraordinary Stays
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Indulge in the finest properties with world-class amenities and breathtaking views
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-amber-500" size={48} />
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No luxury properties available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hotels.map((hotel, i) => (
              <Link
                href={`/hotels/${hotel.slug}`}
                key={hotel._id}
                className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl card-hover block"
              >
                <img
                  src={hotel.coverImage || "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=90"}
                  alt={hotel.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute top-5 left-5 flex items-center gap-2 bg-amber-400/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full capitalize">
                  <Sparkles size={12} />
                  {hotel.propertyType?.replace("_", " ")}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={13}
                          className={
                            j < Math.floor(hotel.rating || 5)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-500"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-white/70 text-xs">({hotel.reviewCount || 0} reviews)</span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1">{hotel.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{hotel.location?.city || hotel.district}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {hotel.hasPool && <span className="text-xs text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">Swimming Pool</span>}
                    {hotel.hasFreeBreakfast && <span className="text-xs text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">Free Breakfast</span>}
                    {hotel.hasFreeWiFi && <span className="text-xs text-white bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">Free WiFi</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-xs">Starting from</p>
                      <p className="text-3xl font-black text-white">
                        ৳{hotel.priceFrom?.toLocaleString() || 0}
                        <span className="text-base font-normal text-white/60">/night</span>
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-amber-400 rounded-2xl font-bold text-sm transition shadow-lg group-hover:bg-amber-400">
                      Book Suite
                      <ChevronRight size={16} />
                    </button>
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
