"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import ThemeToggle from "@/components/ThemeToggle";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {Plus, Search, ArrowUpDown } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and Sort controls
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"deadline" | "title" | "createdAt">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadTasks = async () => {
    try {
      const filters: any = {};
      if (searchQuery.trim()) filters.search = searchQuery;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.sortOrder = sortOrder;

      const data = await API.getTasks(filters);
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks. Please try again.");
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [searchQuery, sortBy, sortOrder]);

  const addTask = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);

    try {
      await API.addTask({
        title,
        description: description || null,
        status: "todo",
        deadline: deadline || null,
      });

      toast.success("Task created successfully!");
      setTitle("");
      setDescription("");
      setDeadline("");
      await loadTasks();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      await API.updateTask(id, updates);
      toast.success("Task updated successfully!");
      await loadTasks();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await API.deleteTask(id);
      toast.success("Task deleted successfully!");
      await loadTasks();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to delete task");
    }
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-3">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              📋 Task Manager
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                Progress
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {completedCount} of {tasks.length} completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {completionPercentage}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                completion rate
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/50"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row  gap-10 mb-6">
          {/* Add Task Form */}
          <div className="mb-4 md:w-1/2 bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Create New Task
            </h2>

            {/* Title and Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div>
                <label
                  htmlFor="task-title"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Title *
                </label>
                <Input
                  id="task-title"
                  placeholder="What do you need to do?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="task-deadline"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Deadline (Optional)
                </label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label
                htmlFor="task-description"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="task-description"
                placeholder="Add details about this task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all resize-none"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={addTask}
              disabled={!title.trim() || isLoading}
              className="w-full px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? "Adding..." : "Add Task"}
            </Button>
          </div>

          {/* Filter and Sort Controls */}
          <div className="mb-4 md:w-1/3 bg-white dark:bg-slate-800 rounded-lg shadow-md p-3 border border-slate-100 dark:border-slate-700">
            <div className="flex flex-col justify-around w-full h-full">
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <Search className="w-3 h-3 inline mr-1" />
                  Search
                </label>
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <ArrowUpDown className="w-3 h-3 inline mr-1" />
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(val) =>
                    setSortBy(val as "deadline" | "title" | "createdAt")
                  }
                >
                  <SelectTrigger className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus-visible:ring-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Newest</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Order
                </label>
                <Select
                  value={sortOrder}
                  onValueChange={(val) => setSortOrder(val as "asc" | "desc")}
                >
                  <SelectTrigger className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus-visible:ring-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* To Do Column */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-300 dark:border-slate-600">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                To Do
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded">
                {tasks.filter((t) => t.status === "todo").length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === "todo").length === 0 ? (
                <p className="text-center py-4 text-slate-500 dark:text-slate-400 text-xs">
                  No tasks
                </p>
              ) : (
                tasks
                  .filter((t) => t.status === "todo")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-300 dark:border-blue-600">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-100">
                In Progress
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 text-xs font-semibold rounded">
                {tasks.filter((t) => t.status === "inProgress").length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === "inProgress").length === 0 ? (
                <p className="text-center py-4 text-slate-500 dark:text-slate-400 text-xs">
                  No tasks
                </p>
              ) : (
                tasks
                  .filter((t) => t.status === "inProgress")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-300 dark:border-green-600">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <h3 className="text-base font-bold text-green-900 dark:text-green-100">
                Completed
              </h3>
              <span className="ml-auto px-2 py-0.5 bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 text-xs font-semibold rounded">
                {tasks.filter((t) => t.status === "completed").length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === "completed").length === 0 ? (
                <p className="text-center py-4 text-slate-500 dark:text-slate-400 text-xs">
                  No tasks
                </p>
              ) : (
                tasks
                  .filter((t) => t.status === "completed")
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
