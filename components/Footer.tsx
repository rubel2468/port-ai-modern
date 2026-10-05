import Link from "next/link";
import {
  Building2, Phone, Mail, MapPin, Facebook,
  Instagram, Youtube, Twitter, ChevronRight, Heart
} from "lucide-react";

const footerLinks = {
  Destinations: ["Sylhet", "Sreemangal", "Moulvibazar", "Sunamganj", "Jaflong", "Ratargul"],
  "Property Types": ["Hotels", "Resorts", "Eco Resorts", "Cottages", "Budget Hotels", "Luxury Stays"],
  Company: ["About Us", "How It Works", "Partner With Us", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Contact Us", "Booking Guide", "Cancellation Policy", "Privacy Policy", "Terms of Service"],
};

const payments = ["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "SSLCommerz"];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">
                  Stay<span className="text-amber-400">BD</span>
                </h3>
                <p className="text-[9px] text-gray-500 font-medium tracking-widest uppercase">
                  Hotel & Resort Marketplace
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Bangladesh&apos;s premier hotel & resort booking platform. Discover and book the best
              properties across Sylhet, Sreemangal, Moulvibazar, Sunamganj and beyond.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3 text-sm text-gray-400 mb-6">
              <a className="flex items-center gap-2 hover:text-white transition">
                <Phone size={14} className="text-primary-400" />
                +880 1700-000000
              </a>
              <a className="flex items-center gap-2 hover:text-white transition">
                <Mail size={14} className="text-primary-400" />
                support@staybd.com
              </a>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-primary-400 mt-0.5 shrink-0" />
                <span>Sylhet & Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, color: "hover:bg-blue-600" },
                { Icon: Instagram, color: "hover:bg-pink-600" },
                { Icon: Youtube, color: "hover:bg-red-600" },
                { Icon: Twitter, color: "hover:bg-sky-500" },
              ].map(({ Icon, color }, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 bg-gray-800 ${color} rounded-xl flex items-center justify-center transition`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-5">{title}</h4>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <a
                    key={link}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-1 group"
                  >
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition text-primary-400 shrink-0"
                    />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-3">We Accept</p>
              <div className="flex flex-wrap gap-2">
                {payments.map((p) => (
                  <span
                    key={p}
                    className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                <span className="text-xs bg-green-900/50 border border-green-700 text-green-400 px-3 py-1 rounded-full font-medium">
                  🔒 SSL Secured
                </span>
                <span className="text-xs bg-blue-900/50 border border-blue-700 text-blue-400 px-3 py-1 rounded-full font-medium">
                  ✓ Verified Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © 2026 StayBD. All rights reserved. Made with{" "}
            <Heart size={12} className="inline text-red-500 fill-red-500" /> in Bangladesh.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <a className="hover:text-white transition cursor-pointer">Privacy Policy</a>
            <span>·</span>
            <a className="hover:text-white transition cursor-pointer">Terms of Service</a>
            <span>·</span>
            <a className="hover:text-white transition cursor-pointer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
