import {
  ShieldCheck, Headphones, CreditCard,
  BadgeCheck, RefreshCcw, Map, Star
} from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Best Price Guarantee",
    text: "Find a lower price anywhere else and we'll match it. Guaranteed lowest rates for every booking.",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
  },
  {
    icon: BadgeCheck,
    title: "Verified Properties",
    text: "All hotels and resorts are manually verified by our team for quality and accuracy.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    text: "Pay via bKash, Nagad, Rocket or card through SSLCommerz. 100% encrypted and safe.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Our Bangladesh-based travel experts are always ready to help you anytime.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: RefreshCcw,
    title: "Free Cancellation",
    text: "Flexible booking with free cancellation on most properties. No questions asked.",
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
  },
  {
    icon: Map,
    title: "Local Expertise",
    text: "We know every corner of Sylhet, Sreemangal, Moulvibazar and Sunamganj.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
];

const trustNumbers = [
  { value: "500+", label: "Partner Hotels" },
  { value: "50K+", label: "Happy Travelers" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-4">
            <Star size={14} className="text-primary-600 fill-primary-600" />
            <span className="text-primary-700 font-semibold text-sm">Why StayBD</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">
            Travel with
            <span className="text-gradient"> Confidence</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Bangladesh&apos;s most trusted hotel booking platform, built for travelers by travelers.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`p-7 rounded-3xl border-2 ${r.border} hover:shadow-xl transition-all group card-hover`}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${r.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
              >
                <r.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{r.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustNumbers.map((t, i) => (
            <div key={i} className="text-center text-white">
              <p className="text-4xl md:text-5xl font-black text-amber-300">{t.value}</p>
              <p className="text-white/70 mt-2 font-medium">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
