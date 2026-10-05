"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tag, Plus, Edit, Trash2, Loader2, Calendar, Percent, DollarSign, ToggleLeft, ToggleRight, X } from "lucide-react";

export default function VendorOffersPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    hotelId: "",
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minNights: 1,
    maxUsage: 0,
    validFrom: "",
    validUntil: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, hotelsRes] = await Promise.all([
        fetch("/api/vendor/offers"),
        fetch("/api/vendor/hotels") // Assuming this returns { hotels: [] } or just an array
      ]);
      
      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(offersData);
      }
      
      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json();
        setHotels(hotelsData.hotels || hotelsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (offer: any = null) => {
    if (offer) {
      setEditingOfferId(offer._id);
      setForm({
        hotelId: offer.hotel._id,
        title: offer.title,
        description: offer.description || "",
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        minNights: offer.minNights,
        maxUsage: offer.maxUsage,
        validFrom: new Date(offer.validFrom).toISOString().split('T')[0],
        validUntil: new Date(offer.validUntil).toISOString().split('T')[0]
      });
    } else {
      setEditingOfferId(null);
      setForm({
        hotelId: hotels.length > 0 ? hotels[0]._id : "",
        title: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minNights: 1,
        maxUsage: 0,
        validFrom: "",
        validUntil: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = "/api/vendor/offers";
      const method = editingOfferId ? "PUT" : "POST";
      const body = editingOfferId ? { offerId: editingOfferId, ...form } : form;
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert("Failed to save offer");
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to deactivate this offer?")) return;
    
    try {
      const res = await fetch("/api/vendor/offers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId })
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  const toggleActiveStatus = async (offer: any) => {
    try {
      await fetch("/api/vendor/offers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          offerId: offer._id, 
          isActive: !offer.isActive 
        })
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Offers & Discounts</h1>
          <p className="text-gray-500 text-sm">Manage promotions for your properties</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add New Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
            <Tag size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No offers yet</h3>
          <p className="text-gray-500 mb-6">Create your first offer to attract more bookings!</p>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary-100 text-primary-700 hover:bg-primary-200 px-6 py-2.5 rounded-xl font-bold transition"
          >
            Create Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map(offer => (
            <div key={offer._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <h3 className="font-bold text-lg leading-tight">{offer.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{offer.hotel?.name}</p>
                </div>
                <div className="bg-amber-100 text-amber-700 font-black text-lg px-3 py-1.5 rounded-xl whitespace-nowrap">
                  {offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `৳${offer.discountValue} OFF`}
                </div>
              </div>
              
              <div className="space-y-3 mt-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag size={16} className="text-gray-400" />
                  <span>Usage: {offer.usedCount} {offer.maxUsage > 0 ? `/ ${offer.maxUsage}` : '(Unlimited)'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Percent size={16} className="text-gray-400" />
                  <span>Min. {offer.minNights} nights</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleActiveStatus(offer)}
                  className={`flex items-center gap-1.5 text-sm font-semibold ${offer.isActive ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {offer.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {offer.isActive ? 'Active' : 'Inactive'}
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(offer)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg my-8 relative">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingOfferId ? "Edit Offer" : "Add New Offer"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Hotel *</label>
                <select 
                  required
                  value={form.hotelId}
                  onChange={(e) => setForm({...form, hotelId: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none"
                >
                  <option value="" disabled>Select a property</option>
                  {hotels.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Offer Title *</label>
                <input 
                  type="text" 
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  placeholder="e.g. Summer Special 20%" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  placeholder="Additional details..."
                  rows={2}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Type *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="discountType" 
                        value="percentage" 
                        checked={form.discountType === "percentage"}
                        onChange={() => setForm({...form, discountType: "percentage"})}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm font-medium">Percent (%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="discountType" 
                        value="flat" 
                        checked={form.discountType === "flat"}
                        onChange={() => setForm({...form, discountType: "flat"})}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm font-medium">Flat (৳)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Value *</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={form.discountValue || ""}
                    onChange={(e) => setForm({...form, discountValue: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Valid From *</label>
                  <input 
                    type="date" 
                    required
                    value={form.validFrom}
                    onChange={(e) => setForm({...form, validFrom: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Valid Until *</label>
                  <input 
                    type="date" 
                    required
                    value={form.validUntil}
                    onChange={(e) => setForm({...form, validUntil: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Min. Nights *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={form.minNights}
                    onChange={(e) => setForm({...form, minNights: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Max Usage (0 = Unlmt)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={form.maxUsage}
                    onChange={(e) => setForm({...form, maxUsage: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition flex justify-center items-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : "Save Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
