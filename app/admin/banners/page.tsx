"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Plus, Edit, Trash2, Loader2, Eye, EyeOff, Calendar, ExternalLink } from "lucide-react";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    position: "hero",
    isActive: true,
    startsAt: "",
    endsAt: "",
    sortOrder: 0
  });

  const positions = ["All", "hero", "top", "middle", "sidebar"];

  useEffect(() => {
    fetchBanners();
  }, [filter]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/banners?position=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";
      const body = editingBanner ? { ...formData, bannerId: editingBanner._id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingBanner(null);
        setFormData({
          title: "", subtitle: "", image: "", link: "", position: "hero", isActive: true, startsAt: "", endsAt: "", sortOrder: 0
        });
        fetchBanners();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch("/api/admin/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerId: id })
      });
      if (res.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      link: banner.link || "",
      position: banner.position || "hero",
      isActive: banner.isActive,
      startsAt: banner.startsAt ? new Date(banner.startsAt).toISOString().split('T')[0] : "",
      endsAt: banner.endsAt ? new Date(banner.endsAt).toISOString().split('T')[0] : "",
      sortOrder: banner.sortOrder || 0
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-primary-600" />
            Banner Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage promotional banners across the platform</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setFormData({
              title: "", subtitle: "", image: "", link: "", position: "hero", isActive: true, startsAt: "", endsAt: "", sortOrder: 0
            });
            setIsModalOpen(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {positions.map(pos => (
          <button
            key={pos}
            onClick={() => setFilter(pos)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === pos ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {pos === "All" ? "All Positions" : pos.charAt(0).toUpperCase() + pos.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
          <ImageIcon className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No Banners Found</h3>
          <p className="text-gray-500 text-sm">Create a banner to display on the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner: any) => (
            <div key={banner._id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
              <div className="relative h-40 bg-gray-100">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="bg-white/90 backdrop-blur text-gray-800 px-2 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm">
                    {banner.position}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 truncate">{banner.title || "Untitled Banner"}</h3>
                {banner.subtitle && <p className="text-sm text-gray-500 truncate mt-1">{banner.subtitle}</p>}
                
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{banner.startsAt ? new Date(banner.startsAt).toLocaleDateString() : 'N/A'} - {banner.endsAt ? new Date(banner.endsAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                    <ExternalLink size={14} />
                    <span className="font-semibold">{banner.clickCount || 0}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400">Order: {banner.sortOrder}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(banner)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(banner._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editingBanner ? "Edit Banner" : "Add Banner"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                {formData.image && (
                  <div className="mt-2 h-32 rounded-xl overflow-hidden bg-gray-100 relative">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input type="url" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="hero">Hero</option>
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={formData.sortOrder || ""} onChange={e => setFormData({...formData, sortOrder: e.target.value ? parseInt(e.target.value) : 0})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={formData.startsAt} onChange={e => setFormData({...formData, startsAt: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={formData.endsAt} onChange={e => setFormData({...formData, endsAt: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 rounded-xl transition">
                  {editingBanner ? "Update Banner" : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
