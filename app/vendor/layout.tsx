"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, PlusCircle, CalendarDays, Wallet, LogOut, Menu, Loader2, Tag, Sparkles, Crown } from "lucide-react";
import { useState } from "react";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  if (!session) return null; // Middleware handles redirect

  const navLinks = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "My Hotels", href: "/vendor/hotels", icon: Building2 },
    { name: "Add Hotel", href: "/vendor/hotels/new", icon: PlusCircle },
    { name: "Bookings", href: "/vendor/bookings", icon: CalendarDays },
    { name: "Earnings", href: "/vendor/earnings", icon: Wallet },
    { name: "Offers", href: "/vendor/offers", icon: Tag },
    { name: "Promotions", href: "/vendor/promotions", icon: Sparkles },
    { name: "Subscription", href: "/vendor/subscription", icon: Crown },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/vendor/dashboard" className="font-black text-xl text-primary-700">StayBD Vendor</Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 fixed inset-y-0 left-0 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-40 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 hidden md:flex">
          <Link href="/vendor/dashboard" className="font-black text-2xl text-primary-700">Stay<span className="text-amber-500">BD</span></Link>
          <span className="ml-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Vendor</span>
        </div>

        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
            {session.user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} className={isActive ? "text-primary-600" : "text-gray-400"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}
