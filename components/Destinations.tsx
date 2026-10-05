"use client";
import { MapPin, ChevronRight, TrendingUp } from "lucide-react";

const destinations = [
  {
    name: "Sylhet",
    tagline: "City of Spiritual Shrines",
    hotels: 142,
    image:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80",
    color: "from-teal-900/80",
    size: "lg:col-span-2 lg:row-span-2",
    height: "h-[380px] lg:h-full",
  },
  {
    name: "Sreemangal",
    tagline: "Tea Capital of Bangladesh",
    hotels: 67,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    color: "from-green-900/80",
    size: "",
    height: "h-[180px]",
  },
  {
    name: "Moulvibazar",
    tagline: "Gateway to Haor",
    hotels: 45,
    image:
      "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=600&q=80",
    color: "from-blue-900/80",
    size: "",
    height: "h-[180px]",
  },
  {
    name: "Sunamganj",
    tagline: "Haor & Wetland Paradise",
    hotels: 28,
    image:
      "https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=600&q=80",
    color: "from-indigo-900/80",
    size: "",
    height: "h-[200px]",
  },
  {
    name: "Jaflong",
    tagline: "Piyain River & Stones",
    hotels: 18,
    image:
      "https://images.unsplash.com/photo-1567393528677-d6adf4b1ae85?auto=format&fit=crop&w=600&q=80",
    color: "from-cyan-900/80",
    size: "",
    height: "h-[200px]",
  },
];

export default function Destinations() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="destinations">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-primary-600 rounded-full" />
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Destinations
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Popular Destinations
            </h2>
            <p className="text-gray-500 mt-2">
              Explore the beauty of Sylhet Division and beyond
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition shrink-0">
            <TrendingUp size={16} />
            View All Destinations
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* First destination — large */}
          {destinations.map((dest, i) => (
            <div
              key={dest.name}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              } ${i === 0 ? "h-[380px] lg:h-auto" : i < 3 ? "h-[200px]" : "h-[200px]"}`}
              style={i === 0 ? { minHeight: "380px" } : {}}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${dest.color} to-transparent`}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className={`font-black text-white ${i === 0 ? "text-3xl" : "text-xl"}`}>
                      {dest.name}
                    </h3>
                    <p className="text-white/70 text-sm mt-0.5">{dest.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin size={12} className="text-white" />
                      <span className="text-white text-xs font-semibold">
                        {dest.hotels} hotels
                      </span>
                    </div>
                  </div>
                </div>

                {i === 0 && (
                  <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-xl text-sm font-semibold transition">
                    Explore Sylhet <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-3xl transition pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
