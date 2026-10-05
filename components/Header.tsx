"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Building2, Menu, X, ChevronDown, Phone, Globe,
  User, Heart, Bell, Search, LogOut, LayoutDashboard
} from "lucide-react";

const navLinks = [
  { label: "Hotels", href: "#hotels" },
  { label: "Resorts", href: "#resorts" },
  { label: "Cottages", href: "#cottages" },
  { label: "Eco Resorts", href: "#eco" },
  { label: "Deals", href: "#deals" },
  { label: "Blog", href: "#blog" },
];

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = (session?.user as any)?.role || "customer";
  const dashboardUrl = role === "admin" ? "/admin/dashboard" : role === "hotel_owner" ? "/vendor/dashboard" : "/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg py-0"
          : "bg-transparent py-0"
      }`}
    >
      {/* Top bar */}
      <div className={`${scrolled ? "hidden" : "block"} bg-primary-700 text-white text-xs`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              +880 1700-000000
            </span>
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-amber-300 transition">
              <Globe size={11} /> EN <ChevronDown size={11} />
            </button>
            <span className="text-primary-300">|</span>
            <button className="hover:text-amber-300 transition">🇧🇩 BDT</button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`max-w-7xl mx-auto px-4 ${scrolled ? "py-3" : "py-4"} flex items-center justify-between`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center shadow-md group-hover:bg-primary-600 transition">
            <Building2 className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-xl font-black tracking-tight leading-none ${scrolled ? "text-gray-900" : "text-white"}`}>
              Stay<span className="text-amber-400">BD</span>
            </h1>
            <p className={`text-[9px] font-medium tracking-widest uppercase ${scrolled ? "text-gray-500" : "text-white/70"}`}>
              Hotel & Resort
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scrolled
                  ? "text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                  : "text-white/90 hover:text-white hover:bg-white/15"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            className={`p-2.5 rounded-xl transition ${
              scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/15"
            }`}
          >
            <Heart size={18} />
          </button>
          <button
            className={`p-2.5 rounded-xl transition ${
              scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/15"
            }`}
          >
            <Bell size={18} />
          </button>
          <div className={`w-px h-6 mx-1 ${scrolled ? "bg-gray-200" : "bg-white/30"}`} />
          {session ? (
            <>
              <Link
                href={dashboardUrl}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"
                }`}
              >
                <User size={16} />
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden p-2 rounded-lg transition ${
            scrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/15"
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-3 text-gray-700 font-medium hover:text-primary-700 hover:bg-primary-50 rounded-xl transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-gray-100" />
            <div className="flex flex-col gap-2">
              {session ? (
                <>
                  <Link href={dashboardUrl} className="w-full py-3 border-2 border-primary-700 text-primary-700 rounded-xl font-semibold text-center block flex justify-center items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <button onClick={() => { setMenuOpen(false); signOut(); }} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-center block flex justify-center items-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link href="/auth/login" className="flex-1 py-3 border-2 border-primary-700 text-primary-700 rounded-xl font-semibold text-center block" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/auth/register" className="flex-1 py-3 bg-amber-400 text-gray-900 rounded-xl font-bold text-center block" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
