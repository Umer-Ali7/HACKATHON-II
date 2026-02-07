"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const demoMessages = [
  { role: "user" as const, text: "Add buy groceries to my list" },
  {
    role: "assistant" as const,
    text: 'Done! I\'ve added "buy groceries" to your tasks.',
    tool: "add_task",
  },
  { role: "user" as const, text: "Show my pending tasks" },
  {
    role: "assistant" as const,
    text: "You have 3 pending tasks:\n1. Buy groceries\n2. Finish report\n3. Call dentist",
    tool: "list_tasks",
  },
  { role: "user" as const, text: "Mark buy groceries as done" },
  {
    role: "assistant" as const,
    text: '"Buy groceries" has been completed!',
    tool: "complete_task",
  },
];

export default function DemoPreview() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < demoMessages.length) {
      const delay = demoMessages[visibleCount]?.role === "user" ? 1200 : 800;
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), delay);
      return () => clearTimeout(timer);
    }
    // Reset after all messages shown
    const resetTimer = setTimeout(() => setVisibleCount(0), 3000);
    return () => clearTimeout(resetTimer);
  }, [visibleCount]);

  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            See it in action
          </h2>
          <p className="mt-3 text-muted-foreground">
            Manage tasks through simple conversation.
          </p>
        </div>

        <Card className="mx-auto max-w-2xl overflow-hidden">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              Todo AI Chatbot
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-3 p-4" style={{ minHeight: "320px" }}>
            {demoMessages.slice(0, visibleCount).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {"tool" in msg && msg.tool && (
                    <span className="mt-1 inline-block rounded-full bg-background/50 px-2 py-0.5 text-xs text-muted-foreground">
                      {msg.tool}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {visibleCount < demoMessages.length && visibleCount > 0 && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-2.5">
                  <div className="flex space-x-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.2s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
