"use client";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Rafiq Ahmed",
    location: "Dhaka",
    avatar: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "StayBD made our Sreemangal trip absolutely perfect! Found the best eco resort at an unbeatable price. The booking process was so smooth and the hotel exactly matched the description.",
    hotel: "Lemon Garden Eco Resort",
    date: "August 2026",
  },
  {
    name: "Nusrat Jahan",
    location: "Chittagong",
    avatar: "https://i.pravatar.cc/100?img=25",
    rating: 5,
    text: "Booked Grand Sultan for our honeymoon. It was literally the best experience of our lives! The customer support team helped us upgrade our room at no extra cost. Highly recommend!",
    hotel: "Grand Sultan Resort & Golf",
    date: "July 2026",
  },
  {
    name: "Karim Hossain",
    location: "Sylhet",
    avatar: "https://i.pravatar.cc/100?img=33",
    rating: 5,
    text: "As a local tour guide I recommend StayBD to all my clients. The platform has the most comprehensive list of Sylhet properties with real photos and honest reviews.",
    hotel: "Nazimgarh Garden Resort",
    date: "June 2026",
  },
  {
    name: "Tahmina Akter",
    location: "Rajshahi",
    avatar: "https://i.pravatar.cc/100?img=44",
    rating: 4,
    text: "Easy payment via bKash, instant confirmation, and the hotel was exactly as shown. Will definitely use StayBD again for my next trip to Jaflong!",
    hotel: "Jaflong Valley Resort",
    date: "May 2026",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            What Our Travelers Say
          </h2>
          <p className="text-gray-500 mt-3">
            Trusted by 50,000+ guests across Bangladesh
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />

          <Quote
            size={56}
            className="text-primary-100 fill-primary-100 absolute top-6 left-6"
          />

          <div className="relative grid md:grid-cols-[1fr_2fr] gap-10 items-center">
            {/* Reviewer info */}
            <div className="flex flex-col items-center text-center">
              <img
                src={testimonials[active].avatar}
                alt={testimonials[active].name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-primary-100 shadow-lg mb-4"
              />
              <h3 className="font-black text-gray-900 text-lg">
                {testimonials[active].name}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={13} />
                {testimonials[active].location}
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < testimonials[active].rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-primary-600 font-semibold">
                  {testimonials[active].hotel}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {testimonials[active].date}
                </p>
              </div>
            </div>

            {/* Review text */}
            <div>
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-10">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all ${
                    i === active
                      ? "w-8 h-3 bg-primary-600"
                      : "w-3 h-3 bg-gray-200 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-11 h-11 rounded-2xl border-2 border-gray-200 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center transition"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-11 h-11 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
