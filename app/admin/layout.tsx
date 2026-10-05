"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, CalendarDays, Percent, Image as ImageIcon, Star, BarChart, FileText, LogOut, Menu, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary-600" size={48} /></div>;
  }

  if (!session || session.user.role !== "admin") return null;

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Vendors", href: "/admin/vendors", icon: Users },
    { name: "Hotels", href: "/admin/hotels", icon: Building2 },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Commission", href: "/admin/commission", icon: Percent },
    { name: "Banners", href: "/admin/banners", icon: ImageIcon },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart },
    { name: "Content", href: "/admin/content", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0d1b2a] text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin/dashboard" className="font-black text-xl">StayBD Admin</Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0d1b2a] text-gray-300 flex-shrink-0 fixed inset-y-0 left-0 transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-40 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-800 hidden md:flex">
          <Link href="/admin/dashboard" className="font-black text-2xl text-white">Stay<span className="text-amber-400">BD</span></Link>
          <span className="ml-2 text-[10px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
        </div>

        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center font-bold">
            A
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-white truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-400 truncate">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold transition border-l-4 ${
                  isActive ? "bg-gray-800 text-amber-400 border-amber-400" : "border-transparent hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-amber-400" : "text-gray-400"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-semibold hover:bg-gray-800 hover:text-white transition"
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
