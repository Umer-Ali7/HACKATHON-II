"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            AI-Powered Task Management
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Manage tasks with
            <br />
            <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              natural language
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Just type what you need. Add tasks, check progress, and stay
            organized &mdash; all through a simple conversation with AI.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Get Started Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg">
                See it in action
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-chart-1/5 blur-3xl" />
      </div>
    </section>
  );
}
