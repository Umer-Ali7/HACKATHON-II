"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ListChecks,
  Clock,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getStats, type StatsData } from "@/lib/api";
import PageTransition from "@/components/layout/PageTransition";

export default function DashboardPage() {
  const { userId } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    getStats(userId)
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.total ?? 0,
      icon: ListChecks,
      color: "text-chart-1",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-chart-4",
    },
    {
      label: "Completed",
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      color: "text-chart-2",
    },
  ];

  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <Link href="/chat/">
            <Button size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Chat
            </Button>
          </Link>
        </div>
        {/* Stat cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.color}`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    {loading ? (
                      <Skeleton className="mt-1 h-7 w-12" />
                    ) : (
                      <p className="text-2xl font-bold">{s.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">7-Day Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats?.activity ?? []}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      tickFormatter={(v: string) => v.slice(5)}
                      stroke="currentColor"
                      className="text-foreground"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "currentColor" }}
                      stroke="currentColor"
                      className="text-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        color: "hsl(var(--foreground))",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Recent tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Tasks</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-10 w-full" />
                  ))}
                </div>
              ) : stats?.recent_tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks yet. Start chatting to add some!
                </p>
              ) : (
                <div className="space-y-2">
                  {stats?.recent_tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                    >
                      <span
                        className={`text-sm ${task.completed ? "text-muted-foreground line-through" : ""}`}
                      >
                        {task.title}
                      </span>
                      <Badge variant={task.completed ? "secondary" : "default"}>
                        {task.completed ? "Done" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
