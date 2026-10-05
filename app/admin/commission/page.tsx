"use client";
import { useState, useEffect } from "react";
import { Percent, Edit3, Loader2, Save } from "lucide-react";

export default function AdminCommission() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(10);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors");
      const json = await res.json();
      if (json.success) setVendors(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/admin/commission/${vendorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate: editRate })
      });
      const json = await res.json();
      if (json.success) {
        setVendors(vendors.map(v => v._id === vendorId ? { ...v, commissionRate: editRate } : v));
        setEditingId(null);
      }
    } catch (err) {
      alert("Failed to update commission");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Commission Rates</h1>
        <p className="text-gray-500 text-sm">Manage platform commission rates per vendor.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-800">
        <Percent size={20} className="mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold">Default Commission: 10%</p>
          <p className="text-sm text-amber-700/80">This rate applies to all vendors automatically. You can override it for specific vendors below.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Vendor Name</th>
                <th className="px-6 py-4 font-bold">Properties</th>
                <th className="px-6 py-4 font-bold">Commission Rate</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendors.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{v.name}</div>
                    <div className="text-xs text-gray-500">{v.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{v.hotelCount} properties</td>
                  <td className="px-6 py-4">
                    {editingId === v._id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="0" max="100" 
                          value={editRate} 
                          onChange={(e) => setEditRate(parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 border border-primary-500 rounded-lg outline-none text-center font-bold text-primary-700"
                        />
                        <span className="font-bold text-gray-500">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-gray-900">{v.commissionRate}%</span>
                        {v.commissionRate !== 10 && (
                          <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Custom</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === v._id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs font-bold transition">Cancel</button>
                        <button onClick={() => handleSave(v._id)} className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition">
                          <Save size={14} /> Save
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(v._id); setEditRate(v.commissionRate); }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold transition"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
