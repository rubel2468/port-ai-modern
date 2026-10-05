"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Sparkles, Plus, Loader2, Star, Crown, Image as ImageIcon,
  Calendar, CheckCircle, Clock, Building2,
} from "lucide-react";

const PROMOTION_TYPES = [
  {
    type: "featured",
    label: "Featured Listing",
    description: "Your hotel appears in the Featured section on the homepage and gets a 'Featured' badge",
    icon: Star,
    color: "amber",
    pricing: { 7: 500, 15: 900, 30: 1500 },
  },
  {
    type: "premium",
    label: "Premium Badge",
    description: "Your hotel gets a 'Premium' badge and priority placement in search results",
    icon: Crown,
    color: "purple",
    pricing: { 7: 1000, 15: 1800, 30: 3000 },
  },
  {
    type: "homepage_banner",
    label: "Homepage Banner",
    description: "Your hotel appears as a banner advertisement on the homepage for maximum visibility",
    icon: ImageIcon,
    color: "blue",
    pricing: { 7: 2000, 15: 3500, 30: 6000 },
  },
];

export default function VendorPromotionsPage() {
  const { data: session } = useSession();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [selectedHotel, setSelectedHotel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [promoRes, hotelsRes] = await Promise.all([
        fetch("/api/vendor/promotions"),
        fetch("/api/vendor/hotels"),
      ]);
      const promoJson = await promoRes.json();
      const hotelsJson = await hotelsRes.json();
      if (promoJson.success) setPromotions(promoJson.data);
      if (hotelsJson.success) setHotels(hotelsJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedHotel || !selectedType) {
      setMessage({ type: "error", text: "Please select a hotel and promotion type" });
      return;
    }
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/vendor/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: selectedHotel,
          type: selectedType,
          duration: selectedDuration,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Promotion activated successfully!" });
        fetchData();
        setTimeout(() => {
          setShowForm(false);
          setMessage({ type: "", text: "" });
        }, 2000);
      } else {
        setMessage({ type: "error", text: json.error || "Failed to create promotion" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPromoType = PROMOTION_TYPES.find((t) => t.type === selectedType);
  const price = selectedPromoType?.pricing[selectedDuration as keyof typeof selectedPromoType.pricing] || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Boost your property visibility with paid promotions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition"
        >
          <Plus size={18} /> New Promotion
        </button>
      </div>

      {/* Create Promotion Form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold mb-6">Create New Promotion</h2>

          {message.text && (
            <div className={`p-4 rounded-xl text-sm font-semibold mb-6 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}

          {/* Step 1: Select Hotel */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Hotel</label>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 appearance-none"
            >
              <option value="">Choose a hotel...</option>
              {hotels.map((hotel: any) => (
                <option key={hotel._id} value={hotel._id}>{hotel.name}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Promotion Type */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Promotion Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROMOTION_TYPES.map((promo) => {
                const Icon = promo.icon;
                const isSelected = selectedType === promo.type;
                return (
                  <button
                    key={promo.type}
                    onClick={() => setSelectedType(promo.type)}
                    className={`text-left p-5 rounded-2xl border-2 transition ${
                      isSelected
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={24} className={isSelected ? "text-primary-600 mb-2" : "text-gray-400 mb-2"} />
                    <h3 className="font-bold text-sm mb-1">{promo.label}</h3>
                    <p className="text-xs text-gray-500">{promo.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Duration */}
          {selectedType && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Duration</label>
              <div className="flex gap-4">
                {[7, 15, 30].map((days) => {
                  const dayPrice = selectedPromoType?.pricing[days as keyof typeof selectedPromoType.pricing] || 0;
                  return (
                    <button
                      key={days}
                      onClick={() => setSelectedDuration(days)}
                      className={`flex-1 p-4 rounded-2xl border-2 text-center transition ${
                        selectedDuration === days
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl font-black">{days}</div>
                      <div className="text-xs text-gray-500 mb-2">days</div>
                      <div className="text-sm font-bold text-primary-700">৳{dayPrice.toLocaleString()}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary & Submit */}
          {selectedType && selectedHotel && (
            <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-black text-gray-900">৳{price.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{selectedDuration} days • {selectedPromoType?.label}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Activate Promotion
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Promotions */}
      <h2 className="text-lg font-bold mb-4">Your Promotions</h2>
      {promotions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold mb-2">No Active Promotions</h3>
          <p className="text-gray-500">Promote your properties to reach more customers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => {
            const promoType = PROMOTION_TYPES.find((t) => t.type === promo.type);
            const Icon = promoType?.icon || Star;
            const isActive = promo.isActive && new Date(promo.expiresAt) > new Date();
            const daysLeft = Math.max(0, Math.ceil((new Date(promo.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

            return (
              <div key={promo._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{promoType?.label}</h3>
                      <p className="text-xs text-gray-500">{promo.hotel?.name}</p>
                    </div>
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      <CheckCircle size={12} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                      <Clock size={12} /> Expired
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-xl p-3">
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-bold text-sm">{promo.duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="font-bold text-sm">৳{promo.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{isActive ? "Days Left" : "Ended"}</p>
                    <p className="font-bold text-sm">{isActive ? daysLeft : "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <Calendar size={12} />
                  {new Date(promo.startsAt).toLocaleDateString()} — {new Date(promo.expiresAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
