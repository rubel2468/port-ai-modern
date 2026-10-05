"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Crown, Check, Loader2, Sparkles, ArrowRight, Building2, Percent, Star, Shield, BarChart3,
} from "lucide-react";

const PLAN_DETAILS = [
  {
    key: "free",
    name: "Free",
    price: 0,
    description: "Get started with basic features",
    color: "gray",
    features: [
      { label: "Up to 2 Hotels", included: true },
      { label: "Standard Commission Rate", included: true },
      { label: "Basic Dashboard", included: true },
      { label: "Featured Slots", included: false },
      { label: "Priority Support", included: false },
      { label: "Advanced Analytics", included: false },
    ],
  },
  {
    key: "silver",
    name: "Silver",
    price: 999,
    description: "For growing businesses",
    color: "slate",
    features: [
      { label: "Up to 5 Hotels", included: true },
      { label: "5% Commission Discount", included: true },
      { label: "Full Dashboard", included: true },
      { label: "1 Featured Slot", included: true },
      { label: "Priority Support", included: false },
      { label: "Advanced Analytics", included: true },
    ],
  },
  {
    key: "gold",
    name: "Gold",
    price: 2499,
    description: "Best for established vendors",
    color: "amber",
    popular: true,
    features: [
      { label: "Up to 15 Hotels", included: true },
      { label: "10% Commission Discount", included: true },
      { label: "Full Dashboard", included: true },
      { label: "3 Featured Slots", included: true },
      { label: "Priority Support", included: true },
      { label: "Advanced Analytics", included: true },
    ],
  },
  {
    key: "platinum",
    name: "Platinum",
    price: 4999,
    description: "For enterprise partners",
    color: "purple",
    features: [
      { label: "Unlimited Hotels", included: true },
      { label: "20% Commission Discount", included: true },
      { label: "Full Dashboard", included: true },
      { label: "10 Featured Slots", included: true },
      { label: "Priority Support", included: true },
      { label: "Advanced Analytics", included: true },
    ],
  },
];

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/vendor/subscription");
      const json = await res.json();
      if (json.success) setSubscription(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (plan === subscription?.plan) return;
    if (!confirm(`Are you sure you want to ${plan === "free" ? "downgrade to" : "upgrade to"} the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan?`)) return;

    setUpgrading(plan);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/vendor/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const json = await res.json();
      if (json.success) {
        setSubscription(json.data);
        setMessage({ type: "success", text: `Successfully switched to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!` });
      } else {
        setMessage({ type: "error", text: json.error || "Failed to update plan" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setUpgrading("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 text-sm mt-1">Choose the plan that best fits your business needs</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold mb-6 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Current Plan */}
      {subscription && (
        <div className="bg-primary-50 border border-primary-200 rounded-3xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center">
              <Crown size={24} />
            </div>
            <div>
              <p className="text-sm text-primary-600 font-semibold">Current Plan</p>
              <p className="text-xl font-black text-gray-900 capitalize">{subscription.plan}</p>
            </div>
          </div>
          {subscription.expiresAt && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Expires</p>
              <p className="text-sm font-bold">{new Date(subscription.expiresAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLAN_DETAILS.map((plan) => {
          const isCurrent = subscription?.plan === plan.key;
          return (
            <div
              key={plan.key}
              className={`relative bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all hover:shadow-lg ${
                isCurrent
                  ? "border-primary-500 ring-2 ring-primary-200"
                  : plan.popular
                    ? "border-amber-400"
                    : "border-gray-100"
              }`}
            >
              {plan.popular && (
                <div className="bg-amber-400 text-gray-900 text-center py-1.5 text-xs font-black uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="bg-primary-600 text-white text-center py-1.5 text-xs font-black uppercase tracking-wider">
                  Current Plan
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-black capitalize mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-gray-900">
                    {plan.price === 0 ? "Free" : `৳${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <span className="text-sm text-gray-500">/month</span>}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check
                        size={16}
                        className={feature.included ? "text-primary-600" : "text-gray-300"}
                      />
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={isCurrent || upgrading === plan.key}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                >
                  {upgrading === plan.key ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isCurrent ? (
                    "Active Plan"
                  ) : (
                    <>
                      {plan.price > (PLAN_DETAILS.find((p) => p.key === subscription?.plan)?.price || 0)
                        ? "Upgrade"
                        : "Switch"}{" "}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Feature</th>
                {PLAN_DETAILS.map((plan) => (
                  <th key={plan.key} className="text-center px-4 py-4 text-xs font-bold text-gray-500 uppercase">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Max Hotels", values: ["2", "5", "15", "Unlimited"] },
                { label: "Commission Discount", values: ["0%", "5%", "10%", "20%"] },
                { label: "Featured Slots", values: ["0", "1", "3", "10"] },
                { label: "Priority Support", values: [false, false, true, true] },
                { label: "Advanced Analytics", values: [false, true, true, true] },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-700">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="text-center px-4 py-4">
                      {typeof val === "boolean" ? (
                        val ? <Check size={18} className="text-primary-600 mx-auto" /> : <span className="text-gray-300">—</span>
                      ) : (
                        <span className="font-bold">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
