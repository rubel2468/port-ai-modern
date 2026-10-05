"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Printer, Download, ArrowLeft, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session, status } = useSession();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/login?callbackUrl=/invoice/" + id;
      return;
    }
    
    if (status === "authenticated") {
      fetchBooking();
    }
  }, [id, status]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}/invoice`);
      const json = await res.json();
      if (json.success) {
        setBooking(json.data);
      } else {
        setError(json.message || "Failed to load invoice");
      }
    } catch (err) {
      setError("An error occurred while fetching the invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;
    
    try {
      // Dynamic import of html2canvas to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
      });
      
      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `Invoice-${booking.bookingId}.jpg`;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      alert("Failed to download image. Please try Print -> Save as PDF.");
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Invoice Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The requested invoice could not be found."}</p>
          <Link href="/dashboard" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold inline-block w-full">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Actions Bar (Hidden on Print) */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition font-medium">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button onClick={handleDownloadImage} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold shadow-sm transition">
              <Download size={16} /> Save as JPG
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold shadow-sm transition">
              <Printer size={16} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* Invoice Paper */}
        <div ref={invoiceRef} className="bg-white rounded-xl shadow-lg p-8 sm:p-12 print:shadow-none print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-200 pb-8 mb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center">
                  <Building2 className="text-white w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-none text-gray-900">
                    Stay<span className="text-amber-500">BD</span>
                  </h1>
                  <p className="text-[9px] font-medium tracking-widest uppercase text-gray-500">
                    Hotel & Resort
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 max-w-[200px]">
                Dhaka, Bangladesh<br/>
                support@staybd.com<br/>
                +880 1700-000000
              </p>
            </div>
            
            <div className="sm:text-right">
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-wider mb-2">Invoice</h2>
              <p className="text-gray-500 text-sm font-medium mb-1">Invoice No: <span className="text-gray-900 font-bold">{booking.bookingId}</span></p>
              <p className="text-gray-500 text-sm font-medium mb-1">Date: <span className="text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</span></p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {booking.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
              </div>
            </div>
          </div>

          {/* Customer & Hotel Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Billed To</h3>
              <p className="font-bold text-gray-900 text-lg">{booking.guestInfo.name}</p>
              <p className="text-gray-600 text-sm mt-1">{booking.guestInfo.email}</p>
              <p className="text-gray-600 text-sm mt-1">{booking.guestInfo.phone}</p>
              {booking.guestInfo.address && <p className="text-gray-600 text-sm mt-1">{booking.guestInfo.address}</p>}
            </div>
            
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Booking Details</h3>
              <p className="font-bold text-gray-900 text-lg">{booking.hotel?.name}</p>
              <p className="text-gray-600 text-sm mt-1">{booking.hotel?.address}</p>
              <p className="text-gray-600 text-sm mt-1">{booking.hotel?.location}, {booking.hotel?.district}</p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Check-In</p>
                  <p className="font-semibold text-sm">{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Check-Out</p>
                  <p className="font-semibold text-sm">{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8 overflow-x-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">Reservation Summary</h3>
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-sm font-semibold text-gray-700">Description</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-center">Nights</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-right">Price/Night</th>
                  <th className="py-3 text-sm font-semibold text-gray-700 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4">
                    <p className="font-semibold text-gray-900">{booking.roomType}</p>
                    <p className="text-xs text-gray-500 mt-1">{booking.guests} Guest(s)</p>
                  </td>
                  <td className="py-4 text-center text-sm text-gray-600">{booking.nights}</td>
                  <td className="py-4 text-right text-sm text-gray-600">৳{booking.pricePerNight.toLocaleString()}</td>
                  <td className="py-4 text-right text-sm font-semibold text-gray-900">৳{booking.subtotal.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end border-t border-gray-200 pt-6">
            <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">৳{booking.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold text-gray-900">৳{booking.taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-black text-primary-700 text-lg">৳{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm italic">Thank you for booking with StayBD!</p>
            <p className="text-gray-400 text-xs mt-1">This is a computer generated invoice and does not require a physical signature.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
