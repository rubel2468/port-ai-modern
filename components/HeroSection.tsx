"use client";
import { useState } from "react";
import { MapPin, Star, TrendingUp, ChevronRight } from "lucide-react";

const slides = [
  {
    bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=90",
    badge: "🏆 #1 Rated in Sylhet",
    title: "Discover Paradise",
    titleHighlight: "in Bangladesh",
    subtitle:
      "Book luxury hotels, eco resorts & mountain cottages across Sylhet, Sreemangal, Moulvibazar and Sunamganj.",
    location: "Sylhet Division",
  },
  {
    bg: "https://images.unsplash.com/photo-1551882547-ff40c4a49f6a?auto=format&fit=crop&w=2000&q=90",
    badge: "🌿 Eco Resort Special",
    title: "Tea Garden",
    titleHighlight: "Retreats",
    subtitle:
      "Immerse yourself in lush tea gardens. Wake up to misty mornings in the heart of Sreemangal.",
    location: "Sreemangal",
  },
  {
    bg: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=90",
    badge: "💎 Luxury Collection",
    title: "5-Star Luxury",
    titleHighlight: "Awaits You",
    subtitle:
      "Experience world-class amenities, rooftop pools, and fine dining in Bangladesh's finest resorts.",
    location: "Moulvibazar",
  },
];

const stats = [
  { value: "500+", label: "Properties" },
  { value: "50K+", label: "Happy Guests" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "24/7", label: "Support" },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      {/* Background image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url('${s.bg}')` }}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center pt-32">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            {slide.badge}
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-4">
            {slide.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              {slide.titleHighlight}
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-8">
            {slide.subtitle}
          </p>

          {/* Location tag */}
          <div className="flex items-center gap-2 text-white/70 mb-10">
            <MapPin size={16} className="text-amber-400" />
            <span className="text-sm">Covering: {slide.location} & more</span>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition shadow-2xl shadow-primary-600/40 hover:shadow-primary-600/60">
              Explore Hotels
              <ChevronRight size={20} />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white rounded-2xl font-semibold text-lg transition">
              View Deals
              <TrendingUp size={20} />
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-36 left-4 md:left-auto md:right-12 flex md:flex-col gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all rounded-full ${
                i === active
                  ? "w-10 h-3 md:w-3 md:h-10 bg-amber-400"
                  : "w-3 h-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-3xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center text-white">
                <p className="text-2xl md:text-3xl font-black">{s.value}</p>
                <p className="text-sm text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
