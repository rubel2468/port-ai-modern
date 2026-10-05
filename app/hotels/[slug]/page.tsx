"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Star, Check, Info, Users, Bed, CheckCircle2, ShieldCheck, Loader2, Phone, Mail, MessageCircle, Calendar } from "lucide-react";
import GoogleMap from "@/components/GoogleMap";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ShareButtons from "@/components/ShareButtons";

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Booking widget state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    fetchHotel();
  }, [params.slug]);

  const fetchHotel = async () => {
    try {
      const res = await fetch(`/api/hotels/${params.slug}`);
      const json = await res.json();
      if (json.success) {
        setHotel(json.data);
        setRooms(json.data.rooms || []);
        setReviews(json.data.reviews || []);
        if (json.data.rooms?.length > 0) {
          setSelectedRoom(json.data.rooms[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      alert("Please select dates and room");
      return;
    }
    const params = new URLSearchParams({
      hotelId: hotel._id,
      roomId: selectedRoom,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/booking/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <Loader2 className="animate-spin text-primary-600" size={64} />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Hotel Not Found</h1>
        <Link href="/hotels" className="text-primary-600 font-bold hover:underline">
          ← Back to Hotels
        </Link>
      </div>
    );
  }

  const selectedRoomData = rooms.find((r) => r._id === selectedRoom);
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  const subtotal = selectedRoomData && nights > 0 ? selectedRoomData.pricePerNight * nights : 0;
  const taxes = Math.round(subtotal * 0.07);
  const total = subtotal + taxes;

  const gallery = [hotel.coverImage, ...(hotel.images || [])].slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/hotels" className="hover:text-primary-600">Hotels</Link>
            <span>/</span>
            <span className="capitalize">{hotel.district}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{hotel.name}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={16} />
                  <span>{hotel.location}, {hotel.address}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                  <Star size={16} className="fill-amber-500" />
                  <span>{hotel.rating.toFixed(1)}</span>
                  <span className="text-gray-500 font-normal">({hotel.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center">
                  {hotel.propertyType.replace("_", " ")}
                </span>
                {hotel.isVerified && (
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                )}
              </div>
              <ShareButtons url={typeof window !== 'undefined' ? window.location.href : ''} title={hotel.name} />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] mb-10 rounded-3xl overflow-hidden">
          <div className="md:col-span-2 h-full relative group">
            <Image src={gallery[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"} alt="Cover" fill className="object-cover group-hover:scale-105 transition duration-500" />
          </div>
          <div className="hidden md:grid grid-cols-1 gap-2 h-full">
            <div className="relative h-full group overflow-hidden">
              <Image src={gallery[1] || gallery[0]} alt="Gallery 1" fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="relative h-full group overflow-hidden">
              <Image src={gallery[2] || gallery[0]} alt="Gallery 2" fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 gap-2 h-full">
            <div className="relative h-full group overflow-hidden">
              <Image src={gallery[3] || gallery[0]} alt="Gallery 3" fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="relative h-full group overflow-hidden">
              <Image src={gallery[4] || gallery[0]} alt="Gallery 4" fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
          </div>
        </div>

        {/* Layout: Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
              {["overview", "rooms", "availability", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h2 className="text-xl font-bold mb-4">About this property</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{hotel.description}</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities?.map((amenity: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                        <Check size={18} className="text-primary-600" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <Info size={20} /> Important Information
                  </h3>
                  <ul className="list-disc list-inside text-amber-800 space-y-2 text-sm">
                    <li>Check-in: {hotel.checkInTime}</li>
                    <li>Check-out: {hotel.checkOutTime}</li>
                    <li>{hotel.cancellationPolicy}</li>
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <GoogleMap latitude={hotel.latitude} longitude={hotel.longitude} hotelName={hotel.name} />
                </div>

                {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h2 className="text-xl font-bold mb-4">Nearby Tourist Spots</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {hotel.nearbyAttractions.map((spot: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} className="text-primary-600" />
                          <span>{spot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-bold mb-4">Contact Property</h2>
                  <div className="flex flex-wrap gap-4">
                    {hotel.phone && (
                      <a href={`tel:${hotel.phone}`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                        <Phone size={18} /> Call
                      </a>
                    )}
                    {hotel.email && (
                      <a href={`mailto:${hotel.email}`} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                        <Mail size={18} /> Email
                      </a>
                    )}
                    {hotel.phone && (
                      <a href={`https://wa.me/${hotel.phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium transition-colors">
                        <MessageCircle size={18} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Rooms */}
            {activeTab === "rooms" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold mb-4">Available Rooms</h2>
                {rooms.map((room) => (
                  <div key={room._id} className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col md:flex-row gap-6 hover:shadow-lg transition">
                    <div className="w-full md:w-1/3 aspect-video relative rounded-2xl overflow-hidden bg-gray-100">
                      <Image src={room.images?.[0] || gallery[0]} alt={room.type} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{room.type}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{room.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1"><Users size={16}/> Up to {room.maxGuests} guests</div>
                          <div className="flex items-center gap-1"><Bed size={16}/> {room.bedType || "Double Bed"}</div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between border-t border-gray-100 pt-4 mt-2">
                        <div>
                          <span className="text-2xl font-black text-primary-700">৳{room.pricePerNight.toLocaleString()}</span>
                          <span className="text-sm text-gray-500"> / night</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRoom(room._id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`px-6 py-2.5 rounded-xl font-bold transition ${selectedRoom === room._id ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                        >
                          {selectedRoom === room._id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Availability */}
            {activeTab === "availability" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-primary-600" />
                  <h2 className="text-xl font-bold">Room Availability</h2>
                </div>
                <p className="text-gray-600 mb-6">Check our calendar to see if we have rooms available for your preferred dates.</p>
                <AvailabilityCalendar hotelSlug={params.slug as string} />
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-4 bg-gray-900 text-white p-6 rounded-3xl">
                  <div className="text-5xl font-black">{hotel.rating.toFixed(1)}</div>
                  <div>
                    <div className="font-bold text-lg">Overall Rating</div>
                    <div className="text-gray-400 text-sm">Based on {hotel.reviewCount} verified reviews</div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No reviews yet.</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold">{review.user?.name || "Guest"}</div>
                          <div className="flex items-center gap-1 text-amber-500 text-sm">
                            <Star size={14} className="fill-amber-500" /> {review.rating}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.body}</p>
                        <div className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Booking Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Starting From</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">৳{hotel.priceFrom?.toLocaleString() || 0}</span>
                  <span className="text-gray-500 font-medium">/night</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value ? parseInt(e.target.value) : 1)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 appearance-none"
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Room Selection</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 appearance-none"
                  >
                    {rooms.map(r => <option key={r._id} value={r._id}>{r.type} (৳{r.pricePerNight})</option>)}
                  </select>
                </div>
              </div>

              {nights > 0 && selectedRoomData && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>৳{selectedRoomData.pricePerNight.toLocaleString()} x {nights} nights</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees (7%)</span>
                    <span>৳{taxes.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-black text-lg text-gray-900">
                    <span>Total</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-primary-600/30"
              >
                Reserve Now
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                <ShieldCheck size={14} className="text-green-600" />
                <span>Secure payment via SSLCommerz</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
