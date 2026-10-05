import { Zap, Clock, Tag, ChevronRight } from "lucide-react";

const offers = [
  {
    title: "Early Bird Discount",
    subtitle: "Book 14 days in advance",
    discount: "30% OFF",
    code: "EARLY30",
    color: "from-primary-600 to-primary-800",
    accent: "bg-primary-500",
    icon: Clock,
    expiry: "Ends Sep 15, 2026",
  },
  {
    title: "Weekend Special",
    subtitle: "Fri-Sun stays only",
    discount: "25% OFF",
    code: "WKND25",
    color: "from-amber-500 to-orange-600",
    accent: "bg-amber-400",
    icon: Zap,
    expiry: "Limited time offer",
  },
  {
    title: "Couple Package",
    subtitle: "Honeymoon & Anniversary",
    discount: "40% OFF",
    code: "LOVE40",
    color: "from-rose-500 to-pink-700",
    accent: "bg-rose-400",
    icon: Tag,
    expiry: "All year round",
  },
];

export default function SpecialOffers() {
  return (
    <section className="py-20 px-4 bg-gray-50" id="deals">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-1 bg-primary-600 rounded-full" />
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                Hot Deals
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Special Offers
            </h2>
            <p className="text-gray-500 mt-2">
              Grab these limited-time deals before they&apos;re gone
            </p>
          </div>
          <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition shrink-0">
            All Offers <ChevronRight size={18} />
          </button>
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, i) => (
            <div
              key={i}
              className={`relative rounded-3xl bg-gradient-to-br ${offer.color} text-white overflow-hidden p-7 card-hover group`}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />

              {/* Icon */}
              <div className={`w-14 h-14 ${offer.accent} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                <offer.icon size={24} className="text-white" />
              </div>

              {/* Discount badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full text-2xl font-black mb-3">
                {offer.discount}
              </div>

              <h3 className="text-xl font-black mb-1">{offer.title}</h3>
              <p className="text-white/75 text-sm mb-5">{offer.subtitle}</p>

              {/* Code */}
              <div className="flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl px-4 py-3 mb-5">
                <span className="text-xs text-white/60">Promo Code:</span>
                <span className="font-black tracking-widest text-amber-300">{offer.code}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">{offer.expiry}</span>
                <button className="flex items-center gap-2 bg-white text-gray-900 hover:bg-amber-300 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-md">
                  Claim Now <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
