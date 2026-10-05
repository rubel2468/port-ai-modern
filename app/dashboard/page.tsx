"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Heart, User as UserIcon, LogOut, Loader2, MapPin, XCircle, Download, Star, CheckCircle } from "lucide-react";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ name: "", phone: "", avatar: "", email: "" });
  
  // Profile update state
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({ bookingId: "", rating: 5, title: "", body: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ type: "", text: "" });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  useEffect(() => {
    if (activeTab === "wishlist") fetchWishlist();
    if (activeTab === "profile") fetchProfile();
    if (activeTab === "reviews") fetchReviews();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success) setBookings(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      const json = await res.json();
      if (json.success) setWishlist(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const json = await res.json();
      if (json.success) setReviews(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveWishlist = async (hotelId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelId })
      });
      const json = await res.json();
      if (json.success) {
        fetchWishlist();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PUT" });
      const json = await res.json();
      if (json.success) {
        alert("Booking cancelled successfully.");
        fetchBookings();
      } else {
        alert(json.error || "Failed to cancel booking");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  const handlePayNow = async (bookingId: string) => {
    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId })
      });
      const json = await res.json();
      if (json.success && json.gatewayUrl) {
        window.location.href = json.gatewayUrl;
      } else {
        alert(json.error || "Payment initialization failed");
      }
    } catch (err) {
      alert("An error occurred");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone, avatar: profile.avatar })
      });
      const json = await res.json();
      if (json.success) {
        setProfileMsg({ type: "success", text: "Profile updated successfully" });
      } else {
        setProfileMsg({ type: "error", text: json.message || "Failed to update profile" });
      }
    } catch (err) {
      setProfileMsg({ type: "error", text: "An error occurred" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setPassLoading(true);
    setPassMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      });
      const json = await res.json();
      if (json.success) {
        setPassMsg({ type: "success", text: "Password changed successfully" });
        setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPassMsg({ type: "error", text: json.message || "Failed to change password" });
      }
    } catch (err) {
      setPassMsg({ type: "error", text: "An error occurred" });
    } finally {
      setPassLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm)
      });
      const json = await res.json();
      if (json.success) {
        setReviewMsg({ type: "success", text: "Review submitted successfully" });
        setReviewForm({ bookingId: "", rating: 5, title: "", body: "" });
        fetchReviews();
      } else {
        setReviewMsg({ type: "error", text: json.message || "Failed to submit review" });
      }
    } catch (err) {
      setReviewMsg({ type: "error", text: "An error occurred" });
    } finally {
      setReviewLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  if (!session) {
    return null; // middleware will redirect
  }

  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Confirmed</span>;
      case "pending": return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">Pending</span>;
      case "cancelled": return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Cancelled</span>;
      case "completed": return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-28">
            <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-black mb-3">
                {session.user?.name?.charAt(0) || "U"}
              </div>
              <h2 className="font-bold text-lg">{session.user?.name}</h2>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>

            <nav className="space-y-2">
              <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${activeTab === "overview" ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <LayoutDashboard size={18} /> Overview
              </button>
              <button onClick={() => setActiveTab("bookings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${activeTab === "bookings" ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <CalendarDays size={18} /> My Bookings
              </button>
              <button onClick={() => setActiveTab("wishlist")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${activeTab === "wishlist" ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <Heart size={18} /> Wishlist
              </button>
              <button onClick={() => setActiveTab("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${activeTab === "reviews" ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <Star size={18} /> Reviews
              </button>
              <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm ${activeTab === "profile" ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <UserIcon size={18} /> Profile
              </button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-semibold text-sm text-red-600 hover:bg-red-50 mt-4">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in">
              <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><CalendarDays size={24}/></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Total Bookings</p>
                    <p className="text-2xl font-black">{bookings.length}</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CalendarDays size={24}/></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Confirmed</p>
                    <p className="text-2xl font-black">{confirmedCount}</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><CalendarDays size={24}/></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Pending Payment</p>
                    <p className="text-2xl font-black">{pendingCount}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-10 mb-4">Recent Bookings</h2>
              {bookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden relative">
                      {booking.hotel?.coverImage && <Image src={booking.hotel.coverImage} alt="Hotel" fill className="object-cover"/>}
                    </div>
                    <div>
                      <h3 className="font-bold">{booking.hotel?.name || "Unknown Hotel"}</h3>
                      <p className="text-xs text-gray-500">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>{getStatusBadge(booking.status)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Bookings */}
          {activeTab === "bookings" && (
            <div className="animate-in fade-in">
              <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">You haven&apos;t made any bookings. Start exploring hotels!</p>
                  <Link href="/hotels" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold">Explore Hotels</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                      <div className="w-full md:w-48 aspect-video relative rounded-2xl overflow-hidden bg-gray-100">
                        {booking.hotel?.coverImage && <Image src={booking.hotel.coverImage} alt="Hotel" fill className="object-cover"/>}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold">{booking.hotel?.name || "Unknown Hotel"}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <MapPin size={14}/> <span className="capitalize">{booking.hotel?.district}</span>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check-in</p>
                            <p className="font-semibold">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check-out</p>
                            <p className="font-semibold">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Room</p>
                            <p className="font-semibold">{booking.roomType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Amount</p>
                            <p className="font-black text-primary-700">৳{booking.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                          {booking.status === "pending" && (
                            <>
                              <button onClick={() => handlePayNow(booking.bookingId)} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold">Pay Now</button>
                              <button onClick={() => handleCancelBooking(booking.bookingId)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center gap-1"><XCircle size={14}/> Cancel</button>
                            </>
                          )}
                          {(booking.status === "confirmed" || booking.status === "completed") && (
                            <Link href={`/invoice/${booking.bookingId}`} target="_blank" className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-bold flex items-center gap-1">
                              <Download size={14}/> Invoice
                            </Link>
                          )}
                          {(booking.status === "confirmed" || booking.status === "completed") && !reviews.some(r => r.booking === booking._id) && (
                            <button onClick={() => { setActiveTab("reviews"); setReviewForm({ ...reviewForm, bookingId: booking._id }); }} className="px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-sm font-bold flex items-center gap-1">
                              <Star size={14}/> Write a Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === "wishlist" && (
            <div className="animate-in fade-in">
              <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold mb-2">No saved hotels yet</h3>
                  <p className="text-gray-500 mb-6">Explore hotels and click the heart icon to save them here.</p>
                  <Link href="/hotels" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold">Explore Hotels</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((hotel) => (
                    <div key={hotel._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                      <button onClick={() => handleRemoveWishlist(hotel._id)} className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 transition-transform">
                        <Heart size={16} fill="currentColor" />
                      </button>
                      <Link href={`/hotels/${hotel.slug}`} className="flex-1 flex flex-col">
                        <div className="w-full aspect-[4/3] relative bg-gray-100">
                          {hotel.coverImage && <Image src={hotel.coverImage} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition duration-300"/>}
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold line-clamp-1">{hotel.name}</h3>
                              <div className="flex items-center gap-1 text-sm font-bold">
                                <Star size={14} className="text-amber-500" fill="currentColor"/> {hotel.rating || "New"}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mb-2"><MapPin size={12}/> {hotel.location}, {hotel.district}</p>
                          </div>
                          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs text-gray-500 capitalize">{hotel.propertyType}</span>
                            <span className="font-black text-primary-700">৳{hotel.priceFrom}<span className="text-xs font-normal text-gray-500">/night</span></span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="animate-in fade-in space-y-8">
              <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
              
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Personal Information</h2>
                {profileMsg.text && (
                  <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${profileMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" value={profile.email} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                    <input type="url" value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://..." />
                  </div>
                  <button type="submit" disabled={profileLoading} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {profileLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Change Password</h2>
                {passMsg.text && (
                  <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${passMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {passMsg.text}
                  </div>
                )}
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" required minLength={6} />
                  </div>
                  <button type="submit" disabled={passLoading} className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {passLoading ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="animate-in fade-in">
              <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
              
              {reviewForm.bookingId ? (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Write a Review</h2>
                    <button onClick={() => setReviewForm({ bookingId: "", rating: 5, title: "", body: "" })} className="text-gray-500 hover:text-gray-700">
                      <XCircle size={20} />
                    </button>
                  </div>
                  
                  {reviewMsg.text && (
                    <div className={`p-3 rounded-xl mb-4 text-sm font-medium ${reviewMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {reviewMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="focus:outline-none hover:scale-110 transition-transform">
                            <Star size={28} className={reviewForm.rating >= star ? "text-amber-500" : "text-gray-300"} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                      <input type="text" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="E.g. Amazing stay, highly recommended!" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Review Details</label>
                      <textarea value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Tell us about your experience..." required />
                    </div>
                    <button type="submit" disabled={reviewLoading} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                      {reviewLoading ? <Loader2 size={18} className="animate-spin" /> : "Submit Review"}
                    </button>
                  </form>
                </div>
              ) : null}

              {reviews.length === 0 && !reviewForm.bookingId ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <Star size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold mb-2">No reviews yet</h3>
                  <p className="text-gray-500 mb-6">Complete a stay to write a review about your experience.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link href={`/hotels/${review.hotel?.slug}`} className="font-bold text-lg hover:text-primary-600 transition">{review.hotel?.name}</Link>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? "text-amber-500" : "text-gray-300"} fill={i < review.rating ? "currentColor" : "none"} />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold mb-2">{review.title}</h4>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{review.body}</p>
                      {review.isVerifiedStay && (
                        <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                          <CheckCircle size={12} /> Verified Stay
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
