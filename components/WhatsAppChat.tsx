"use client";
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppChat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801700000000";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Hi, I need help with hotel booking on StayBD")}`;

  useEffect(() => {
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dismissed]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {showTooltip && !dismissed && (
        <div className="mb-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 relative animate-fade-in-up">
          <button 
            onClick={() => {
              setShowTooltip(false);
              setDismissed(true);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
          <p className="text-sm font-medium text-gray-800 pr-4">
            Need Help? Chat with us!
          </p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45" />
        </div>
      )}
      
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform group"
      >
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75" />
        <MessageCircle size={28} className="relative z-10" />
      </a>
    </div>
  );
}
