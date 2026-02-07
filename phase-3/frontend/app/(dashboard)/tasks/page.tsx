"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Circle,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  type TaskItem,
} from "@/lib/api";
import { toast } from "sonner";
import PageTransition from "@/components/layout/PageTransition";

type FilterStatus = "all" | "pending" | "completed";

export default function TasksPage() {
  const { userId } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await listTasks(userId, filter, search);
      setTasks(data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [userId, filter, search]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async () => {
    if (!userId || !newTitle.trim()) return;
    setCreating(true);
    try {
      await createTask(userId, newTitle.trim(), newDesc.trim() || undefined);
      toast.success("Task created");
      setNewTitle("");
      setNewDesc("");
      setDialogOpen(false);
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (task: TaskItem) => {
    if (!userId) return;
    try {
      await updateTask(userId, task.id, { completed: !task.completed });
      toast.success(task.completed ? "Task reopened" : "Task completed");
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!userId) return;
    try {
      await deleteTask(userId, taskId);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const filters: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <PageTransition>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Tasks</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Input
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Add details..."
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  className="w-full"
                  disabled={!newTitle.trim() || creating}
                >
                  {creating ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-1">
            {filters.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Task list */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-0 divide-y divide-border">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                {search
                  ? "No tasks match your search."
                  : "No tasks yet. Create one or use the chat!"}
              </div>
            ) : (
              <div className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <button
                        onClick={() => handleToggle(task)}
                        className="shrink-0 text-muted-foreground hover:text-primary"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-chart-2" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm ${task.completed ? "text-muted-foreground line-through" : ""}`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={task.completed ? "secondary" : "default"}
                        className="shrink-0 text-xs"
                      >
                        {task.completed ? "Done" : "Pending"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
