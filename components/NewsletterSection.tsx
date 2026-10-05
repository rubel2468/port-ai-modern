"use client";
import { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed! Welcome to StayBD!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 rounded-3xl overflow-hidden p-10 md:p-16 text-center">
          {/* Decorative bg */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail size={28} className="text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Get Exclusive Deals
            </h2>
            <p className="text-white/75 text-lg max-w-xl mx-auto mb-8">
              Subscribe to our newsletter and be the first to know about special offers,
              new properties, and travel inspiration.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-5 max-w-md mx-auto">
                <CheckCircle size={24} className="text-green-300" />
                <span className="text-white font-bold">
                  {message}
                </span>
              </div>
            ) : (
              <div className="max-w-md mx-auto flex flex-col">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={status === "loading"}
                    className="flex-1 px-5 py-4 rounded-2xl text-gray-900 bg-white placeholder-gray-400 text-sm font-medium outline-none focus:ring-4 focus:ring-white/30 disabled:opacity-70"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 px-7 py-4 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-2xl font-bold text-sm transition shadow-xl whitespace-nowrap disabled:opacity-70"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
                {status === "error" && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-red-200 text-sm font-medium">
                    <AlertCircle size={16} />
                    <span>{message}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-white/50 text-xs mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
