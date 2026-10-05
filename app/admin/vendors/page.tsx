"use client";
import { useState, useEffect } from "react";
import { Check, X, Shield, Search, Loader2 } from "lucide-react";

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vendors?status=${filter}`);
      const json = await res.json();
      if (json.success) setVendors(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (vendorId: string, hotelId: string, status: string) => {
    try {
      let reason = "";
      if (status === "rejected") {
        reason = prompt("Reason for rejection:") || "Did not meet criteria";
      }
      
      const res = await fetch(`/api/admin/hotels/${hotelId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorStatus: status, rejectionReason: reason })
      });
      
      const json = await res.json();
      if (json.success) {
        fetchVendors();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Vendor Management</h1>
          <p className="text-gray-500 text-sm">Approve or reject hotel owners and their properties.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition ${
              filter === f ? "bg-[#0d1b2a] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No vendors found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Vendor Info</th>
                  <th className="px-6 py-4 font-bold">Properties</th>
                  <th className="px-6 py-4 font-bold">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                          {v.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-1">
                            {v.name}
                            {v.isVerified && <Shield size={12} className="text-blue-500" />}
                          </div>
                          <div className="text-xs text-gray-500">{v.email}</div>
                          <div className="text-xs text-gray-500">{v.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {v.hotels.length === 0 ? <span className="text-gray-400 italic">No properties yet</span> : (
                        <div className="space-y-2">
                          {v.hotels.map((h: any) => (
                            <div key={h._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <span className="font-semibold text-gray-700">{h.name}</span>
                              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                                h.vendorStatus === 'approved' ? 'bg-green-100 text-green-700' :
                                h.vendorStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {h.vendorStatus}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {v.hotels.map((h: any) => h.vendorStatus === "pending" && (
                          <div key={h._id} className="flex gap-2">
                            <button onClick={() => handleStatusUpdate(v._id, h._id, 'approved')} className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-bold flex items-center gap-1">
                              <Check size={14} /> Approve
                            </button>
                            <button onClick={() => handleStatusUpdate(v._id, h._id, 'rejected')} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-bold flex items-center gap-1">
                              <X size={14} /> Reject
                            </button>
                          </div>
                        ))}
                        {v.hotels.every((h: any) => h.vendorStatus !== "pending") && v.hotels.length > 0 && (
                          <span className="text-gray-400 italic text-xs">All actions complete</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
