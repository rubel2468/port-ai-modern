"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Star, Filter, SlidersHorizontal, Loader2, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  
  // Filters state
  const [district, setDistrict] = useState(searchParams.get("district") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Amenities
  const [hasAC, setHasAC] = useState(searchParams.get("hasAC") === "true");
  const [hasPool, setHasPool] = useState(searchParams.get("hasPool") === "true");
  const [hasFreeBreakfast, setHasFreeBreakfast] = useState(searchParams.get("hasFreeBreakfast") === "true");
  const [hasFreeWiFi, setHasFreeWiFi] = useState(searchParams.get("hasFreeWiFi") === "true");
  const [hasParking, setHasParking] = useState(searchParams.get("hasParking") === "true");
  const [isPetFriendly, setIsPetFriendly] = useState(searchParams.get("isPetFriendly") === "true");
  const [isCouplesFriendly, setIsCouplesFriendly] = useState(searchParams.get("isCouplesFriendly") === "true");
  const [isFamilyFriendly, setIsFamilyFriendly] = useState(searchParams.get("isFamilyFriendly") === "true");
  const [hasNatureView, setHasNatureView] = useState(searchParams.get("hasNatureView") === "true");

  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hotels?${searchParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setHotels(json.data);
        setPagination(json.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newPage = 1) => {
    const params = new URLSearchParams();
    if (district) params.set("district", district);
    if (type) params.set("type", type);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (search) params.set("search", search);
    if (sortBy && sortBy !== "featured") params.set("sort", sortBy);
    if (guests) params.set("guests", guests);
    
    if (hasAC) params.set("hasAC", "true");
    if (hasPool) params.set("hasPool", "true");
    if (hasFreeBreakfast) params.set("hasFreeBreakfast", "true");
    if (hasFreeWiFi) params.set("hasFreeWiFi", "true");
    if (hasParking) params.set("hasParking", "true");
    if (isPetFriendly) params.set("isPetFriendly", "true");
    if (isCouplesFriendly) params.set("isCouplesFriendly", "true");
    if (isFamilyFriendly) params.set("isFamilyFriendly", "true");
    if (hasNatureView) params.set("hasNatureView", "true");

    if (newPage > 1) params.set("page", newPage.toString());
    
    setPage(newPage);
    router.push(`/hotels?${params.toString()}`);
  };

  const handleClear = () => {
    setDistrict("");
    setType("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setSortBy("featured");
    setGuests("");
    setHasAC(false);
    setHasPool(false);
    setHasFreeBreakfast(false);
    setHasFreeWiFi(false);
    setHasParking(false);
    setIsPetFriendly(false);
    setIsCouplesFriendly(false);
    setIsFamilyFriendly(false);
    setHasNatureView(false);
    setPage(1);
    router.push("/hotels");
  };

  const removeFilter = (key: string) => {
    if (key === "district") setDistrict("");
    if (key === "type") setType("");
    if (key === "category") setCategory("");
    if (key === "minPrice") setMinPrice("");
    if (key === "maxPrice") setMaxPrice("");
    if (key === "guests") setGuests("");
    if (key === "hasAC") setHasAC(false);
    if (key === "hasPool") setHasPool(false);
    if (key === "hasFreeBreakfast") setHasFreeBreakfast(false);
    if (key === "hasFreeWiFi") setHasFreeWiFi(false);
    if (key === "hasParking") setHasParking(false);
    if (key === "isPetFriendly") setIsPetFriendly(false);
    if (key === "isCouplesFriendly") setIsCouplesFriendly(false);
    if (key === "isFamilyFriendly") setIsFamilyFriendly(false);
    if (key === "hasNatureView") setHasNatureView(false);
    
    // Defer update so state can propagate
    setTimeout(() => updateFilters(1), 0);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Top Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by hotel name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition"
          />
        </div>
        <div className="flex-1 relative w-full">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition appearance-none"
          >
            <option value="">All Districts</option>
            <option value="sylhet">Sylhet</option>
            <option value="sreemangal">Sreemangal</option>
            <option value="moulvibazar">Moulvibazar</option>
            <option value="sunamganj">Sunamganj</option>
            <option value="habiganj">Habiganj</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setTimeout(() => updateFilters(1), 0);
            }}
            className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition appearance-none"
          >
            <option value="featured">Featured (Default)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="bookings">Most Booked</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <button
          onClick={() => updateFilters(1)}
          className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
        >
          <Search size={18} /> Search
        </button>
      </div>

      {/* Active Filters Chips */}
      <div className="flex flex-wrap gap-2 mb-8 min-h-[32px]">
        {district && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
            District: {district} <X size={14} className="cursor-pointer" onClick={() => removeFilter("district")} />
          </span>
        )}
        {type && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
            Type: {type.replace("_", " ")} <X size={14} className="cursor-pointer" onClick={() => removeFilter("type")} />
          </span>
        )}
        {category && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
            Category: {category} <X size={14} className="cursor-pointer" onClick={() => removeFilter("category")} />
          </span>
        )}
        {(minPrice || maxPrice) && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
            Price: {minPrice || 0} - {maxPrice || 'Any'} <X size={14} className="cursor-pointer" onClick={() => { removeFilter("minPrice"); removeFilter("maxPrice"); }} />
          </span>
        )}
        {guests && (
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
            Guests: {guests}+ <X size={14} className="cursor-pointer" onClick={() => removeFilter("guests")} />
          </span>
        )}
        {hasAC && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">AC <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasAC")} /></span>}
        {hasPool && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Pool <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasPool")} /></span>}
        {hasFreeBreakfast && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Free Breakfast <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasFreeBreakfast")} /></span>}
        {hasFreeWiFi && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Free WiFi <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasFreeWiFi")} /></span>}
        {hasParking && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Parking <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasParking")} /></span>}
        {isPetFriendly && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Pet Friendly <X size={14} className="cursor-pointer" onClick={() => removeFilter("isPetFriendly")} /></span>}
        {isCouplesFriendly && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Couple Friendly <X size={14} className="cursor-pointer" onClick={() => removeFilter("isCouplesFriendly")} /></span>}
        {isFamilyFriendly && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Family Friendly <X size={14} className="cursor-pointer" onClick={() => removeFilter("isFamilyFriendly")} /></span>}
        {hasNatureView && <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">Nature View <X size={14} className="cursor-pointer" onClick={() => removeFilter("hasNatureView")} /></span>}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal size={20} className="text-primary-600" /> Filters
              </h2>
              <button onClick={handleClear} className="text-sm text-gray-500 hover:text-primary-600 font-semibold">
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Property Type */}
              <div>
                <h3 className="font-semibold mb-3">Property Type</h3>
                <div className="space-y-2">
                  {["hotel", "resort", "cottage", "eco_resort"].map((t) => (
                    <label key={t} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="type"
                        checked={type === t}
                        onChange={() => setType(t)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-gray-600 group-hover:text-gray-900 capitalize">
                        {t.replace("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-3">Category</h3>
                <div className="space-y-2">
                  {["luxury", "standard", "budget"].map((c) => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={category === c}
                        onChange={() => setCategory(c)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-gray-600 group-hover:text-gray-900 capitalize">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-3">Guests</h3>
                <input
                  type="number"
                  min="1"
                  placeholder="Min. Guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Price Range */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-3">Price Range (৳)</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Amenities & Features */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-3">Amenities & Features</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasAC} onChange={(e) => setHasAC(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">AC / Non-AC</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasPool} onChange={(e) => setHasPool(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Swimming Pool</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasFreeBreakfast} onChange={(e) => setHasFreeBreakfast(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Free Breakfast</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={isCouplesFriendly} onChange={(e) => setIsCouplesFriendly(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Couple Friendly</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={isFamilyFriendly} onChange={(e) => setIsFamilyFriendly(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Family Friendly</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasFreeWiFi} onChange={(e) => setHasFreeWiFi(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">WiFi Available</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Parking Facility</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={isPetFriendly} onChange={(e) => setIsPetFriendly(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Pet Friendly</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={hasNatureView} onChange={(e) => setHasNatureView(e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 rounded" />
                    <span className="text-gray-600 group-hover:text-gray-900">Nature View</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => updateFilters(1)}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">No hotels found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-primary-50 text-primary-600 font-semibold rounded-lg hover:bg-primary-100 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">{pagination.total} Properties found</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <Image
                        src={hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {hotel.isFeatured && (
                        <div className="absolute top-4 left-4 bg-amber-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Star className="text-amber-500 fill-amber-500" size={14} />
                        <span className="text-xs font-bold">{hotel.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                        <MapPin size={14} />
                        <span className="capitalize">{hotel.location}, {hotel.district}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition">
                        {hotel.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded-md">
                          {hotel.propertyType.replace("_", " ")}
                        </span>
                        {hotel.isPremium && (
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] uppercase font-bold rounded-md">
                            Premium
                          </span>
                        )}
                        {hotel.isVerified && (
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-[10px] uppercase font-bold rounded-md flex items-center gap-1">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-primary-700">৳{hotel.priceFrom?.toLocaleString() || 0}</span>
                            <span className="text-xs text-gray-500">/night</span>
                          </div>
                        </div>
                        <Link
                          href={`/hotels/${hotel.slug}`}
                          className="px-4 py-2 bg-gray-900 hover:bg-primary-600 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => updateFilters(page - 1)}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilters(p)}
                      className={`w-10 h-10 rounded-xl font-bold transition ${
                        page === p
                          ? "bg-primary-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => updateFilters(page + 1)}
                    disabled={page === pagination.pages}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={48} /></div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
