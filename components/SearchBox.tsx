"use client";
import { useState } from "react";
import {
  MapPin, CalendarDays, Users, Search,
  ChevronDown, SlidersHorizontal, Building2,
  Trees, Home, Leaf
} from "lucide-react";

const propertyTypes = [
  { icon: Building2, label: "Hotel" },
  { icon: Home, label: "Resort" },
  { icon: Trees, label: "Cottage" },
  { icon: Leaf, label: "Eco Resort" },
];

const locations = [
  "Sylhet City", "Sreemangal", "Moulvibazar", "Sunamganj",
  "Jaflong", "Ratargul", "Bichanakandi", "Lawachara"
];

export default function SearchBox() {
  const [activeType, setActiveType] = useState("Hotel");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <section className="relative z-30 -mt-6 px-4 pb-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Property type tabs */}
          <div className="flex border-b border-gray-100">
            {propertyTypes.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveType(label)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                  activeType === label
                    ? "border-b-2 border-primary-600 text-primary-700 bg-primary-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Search fields */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Location
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-200 focus-within:border-primary-500 rounded-2xl px-4 py-3 transition-all bg-gray-50 focus-within:bg-white">
                  <MapPin size={18} className="text-primary-600 shrink-0" />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Where to go?</option>
                    {locations.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Check-In
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-200 focus-within:border-primary-500 rounded-2xl px-4 py-3 transition-all bg-gray-50 focus-within:bg-white">
                  <CalendarDays size={18} className="text-primary-600 shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Check-Out
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-200 focus-within:border-primary-500 rounded-2xl px-4 py-3 transition-all bg-gray-50 focus-within:bg-white">
                  <CalendarDays size={18} className="text-primary-600 shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium text-gray-800 outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Guests
                </label>
                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 bg-gray-50">
                  <Users size={18} className="text-primary-600 shrink-0" />
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-primary-100 hover:text-primary-700 text-gray-600 font-bold transition flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center text-sm font-bold text-gray-800">
                      {guests} Guest{guests > 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => setGuests(guests + 1)}
                      className="w-7 h-7 rounded-full bg-gray-200 hover:bg-primary-100 hover:text-primary-700 text-gray-600 font-bold transition flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 hover:border-primary-400 rounded-2xl text-sm font-semibold text-gray-600 hover:text-primary-700 transition"
              >
                <SlidersHorizontal size={16} />
                More Filters
              </button>

              <button className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-2xl text-base font-bold transition shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50">
                <Search size={19} />
                Search {activeType}s
              </button>
            </div>

            {/* Expanded filter panel */}
            {showFilter && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  "AC", "Swimming Pool", "Free Breakfast",
                  "WiFi", "Parking", "Couple Friendly",
                  "Family Friendly", "Pet Friendly", "Nature View", "Top Rated"
                ].map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition text-sm"
                  >
                    <input type="checkbox" className="accent-primary-600" />
                    <span className="text-gray-700 font-medium">{filter}</span>
                  </label>
                ))}

                {/* Price range */}
                <div className="col-span-2 sm:col-span-3 md:col-span-5 mt-2">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Price Range (BDT/night)</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">৳ 500</span>
                    <input type="range" min="500" max="50000" className="flex-1" />
                    <span className="text-sm text-gray-600">৳ 50,000</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
