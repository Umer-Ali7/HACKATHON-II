"use client";

import { motion } from "framer-motion";
import { MessageSquare, ListChecks, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language",
    description:
      "Just type what you need. \"Add buy groceries\" or \"Show my pending tasks\" — the AI understands.",
  },
  {
    icon: ListChecks,
    title: "Full Task Management",
    description:
      "Create, update, complete, and delete tasks. Filter by status, search by title, and stay organized.",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Stats",
    description:
      "See your productivity at a glance with completion stats, recent tasks, and a 7-day activity chart.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Everything you need
          </h2>
          <p className="mt-3 text-muted-foreground">
            A complete task management system powered by AI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
