"use client";
import { useState, useEffect } from "react";
import { Users, Search, Shield, Building2, UserIcon, Loader2, MoreVertical, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filters = ["All", "Customers", "Vendors", "Admins"];

  useEffect(() => {
    fetchUsers(1);
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?role=${filter}&search=${search}&page=${page}&limit=${pagination.limit}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    if (!confirm(`Change this user's role to ${role}?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, role })
      });
      if (res.ok) {
        fetchUsers(pagination.page);
        setActiveDropdown(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to change role");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id })
      });
      if (res.ok) {
        fetchUsers(pagination.page);
        setActiveDropdown(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to deactivate user");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-primary-600" />
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage customers, vendors, and admins</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                filter === f ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-primary-600" size={32} />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
          <Users className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No Users Found</h3>
          <p className="text-gray-500 text-sm">No users matching your search or filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold text-center">Bookings</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user: any) => (
                  <tr key={user._id} className={`hover:bg-gray-50 transition ${user.isDeactivated ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                          {user.avatar ? <img src={user.avatar} className="w-10 h-10 rounded-full" alt="avatar" /> : user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900 flex items-center gap-1">
                            {user.name}
                            {user.isVerified && <CheckCircle size={14} className="text-blue-500" />}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'hotel_owner' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' && <Shield size={10} />}
                        {user.role === 'hotel_owner' && <Building2 size={10} />}
                        {user.role === 'customer' && <UserIcon size={10} />}
                        {user.role === 'hotel_owner' ? 'vendor' : user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {user.phone || "N/A"}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-semibold text-gray-700">{user.bookingCount}</span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition">
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeDropdown === user._id && (
                        <div className="absolute right-8 top-10 bg-white border border-gray-100 shadow-lg rounded-xl w-40 z-10 py-1 overflow-hidden">
                          <button onClick={() => handleRoleChange(user._id, 'customer')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Make Customer</button>
                          <button onClick={() => handleRoleChange(user._id, 'hotel_owner')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Make Vendor</button>
                          <button onClick={() => handleRoleChange(user._id, 'admin')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Make Admin</button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button onClick={() => handleDeactivate(user._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Deactivate</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
