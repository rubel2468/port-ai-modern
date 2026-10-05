"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Building2, Mail, Lock, User, Phone, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      // Auto login after register
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-700 to-teal-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-sm w-full">
          <CheckCircle size={64} className="text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900">Account Created!</h2>
          <p className="text-gray-500 mt-2">Check your email for a welcome message. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white">Stay<span className="text-amber-300">BD</span></h1>
              <p className="text-[10px] text-white/60 uppercase tracking-widest">Hotel & Resort</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Create Account 🚀</h2>
          <p className="text-gray-500 mb-7">Join 50,000+ travelers on StayBD</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm mb-5">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="name" type="text" value={form.name} onChange={handleChange}
                required placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-primary-500 rounded-2xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                required placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-primary-500 rounded-2xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-primary-500 rounded-2xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                required placeholder="Password (min. 6 characters)"
                className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 focus:border-primary-500 rounded-2xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirm" type="password" value={form.confirm} onChange={handleChange}
                required placeholder="Confirm Password"
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-primary-500 rounded-2xl text-sm outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-2xl font-bold text-base transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Creating Account...</> : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
