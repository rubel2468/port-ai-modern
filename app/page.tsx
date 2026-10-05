"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchBox from "@/components/SearchBox";
import FeaturedHotels from "@/components/FeaturedHotels";
import BudgetHotels from "@/components/BudgetHotels";
import EcoResorts from "@/components/EcoResorts";
import LuxurySection from "@/components/LuxurySection";
import Destinations from "@/components/Destinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import SpecialOffers from "@/components/SpecialOffers";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SearchBox />
      <FeaturedHotels />
      <BudgetHotels />
      <EcoResorts />
      <LuxurySection />
      <Destinations />
      <WhyChooseUs />
      <SpecialOffers />
      <Testimonials />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
