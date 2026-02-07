"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import DemoPreview from "@/components/home/DemoPreview";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <DemoPreview />
      </main>
      <Footer />
    </div>
  );
}
