"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

export default function AddHotelPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    propertyType: "hotel",
    category: "standard",
    starRating: 3,
    district: "sylhet",
    location: "",
    address: "",
    coverImage: "",
    images: [""],
    amenities: ["WiFi"],
    rooms: [
      { type: "Standard Room", description: "", pricePerNight: 1500, maxGuests: 2, totalCount: 5, amenities: ["WiFi", "AC"] }
    ]
  });

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddRoom = () => {
    setForm({
      ...form,
      rooms: [...form.rooms, { type: "", description: "", pricePerNight: 0, maxGuests: 2, totalCount: 1, amenities: [] }]
    });
  };

  const updateRoom = (index: number, field: string, value: any) => {
    const newRooms = [...form.rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setForm({ ...form, rooms: newRooms });
  };

  const removeRoom = (index: number) => {
    const newRooms = form.rooms.filter((_, i) => i !== index);
    setForm({ ...form, rooms: newRooms });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vendor/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        alert("Hotel added successfully! Pending admin approval.");
        router.push("/vendor/hotels");
      } else {
        alert(json.error || "Failed to add hotel");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Basic Info", "Location", "Rooms", "Images & Finish"];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Property</h1>
          <p className="text-gray-500 text-sm">List your property on StayBD</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"
            }`}>
              {step > i + 1 ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-sm font-semibold hidden md:block ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
            {i < steps.length - 1 && <ChevronRight size={16} className="text-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">Property Name *</label>
              <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="e.g. Grand Sultan Tea Resort" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Property Type *</label>
                <select value={form.propertyType} onChange={(e) => updateForm("propertyType", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none">
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="cottage">Cottage</option>
                  <option value="eco_resort">Eco Resort</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none">
                  <option value="luxury">Luxury</option>
                  <option value="standard">Standard</option>
                  <option value="budget">Budget</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="Describe your property..."></textarea>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">District *</label>
                <select value={form.district} onChange={(e) => updateForm("district", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none">
                  <option value="sylhet">Sylhet</option>
                  <option value="sreemangal">Sreemangal</option>
                  <option value="moulvibazar">Moulvibazar</option>
                  <option value="sunamganj">Sunamganj</option>
                  <option value="habiganj">Habiganj</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Area / City *</label>
                <input type="text" value={form.location} onChange={(e) => updateForm("location", e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="e.g. Sreemangal Town" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Full Address *</label>
              <textarea value={form.address} onChange={(e) => updateForm("address", e.target.value)} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="Street address..."></textarea>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Rooms Setup</h2>
              <button onClick={handleAddRoom} className="flex items-center gap-1 text-primary-600 font-bold bg-primary-50 px-3 py-1.5 rounded-lg text-sm"><Plus size={16}/> Add Room</button>
            </div>
            
            {form.rooms.map((room, index) => (
              <div key={index} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 relative">
                {form.rooms.length > 1 && (
                  <button onClick={() => removeRoom(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1.5 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Room Type Name</label>
                    <input type="text" value={room.type} onChange={(e) => updateRoom(index, "type", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Deluxe Double Room" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price per Night (৳)</label>
                    <input type="number" value={room.pricePerNight || ""} onChange={(e) => updateRoom(index, "pricePerNight", e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Total Rooms of this type</label>
                    <input type="number" value={room.totalCount || ""} onChange={(e) => updateRoom(index, "totalCount", e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Guests</label>
                    <input type="number" value={room.maxGuests || ""} onChange={(e) => updateRoom(index, "maxGuests", e.target.value === "" ? "" : parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold mb-4">Images & Final Review</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">Cover Image *</label>
              <ImageUploader 
                defaultImage={form.coverImage} 
                onUpload={(url) => updateForm("coverImage", url)} 
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold">Gallery Image URLs</label>
                <button type="button" onClick={() => updateForm("images", [...form.images, ""])} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                  <Plus size={14}/> Add More
                </button>
              </div>
              <div className="space-y-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input type="text" value={img} onChange={(e) => {
                        const newImgs = [...form.images];
                        newImgs[idx] = e.target.value;
                        updateForm("images", newImgs);
                      }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 outline-none" placeholder="Gallery image URL..." />
                    </div>
                    {form.images.length > 1 && (
                      <button type="button" onClick={() => updateForm("images", form.images.filter((_, i) => i !== idx))} className="p-3 text-red-500 hover:bg-red-50 rounded-xl mt-1">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1}
            className="px-6 py-3 font-bold text-gray-600 disabled:opacity-30"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition flex items-center gap-2"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : "Submit for Approval"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
