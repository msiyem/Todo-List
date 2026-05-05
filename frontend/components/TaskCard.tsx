"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, Check, X, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    const deadline = new Date(dateString);
    deadline.setHours(23, 59, 59, 999);
    return (
      deadline < new Date() &&
      new Date().toDateString() !== deadline.toDateString()
    );
  } catch {
    return false;
  }
}

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
    case "inProgress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "";
  }
}

function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "inProgress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || "",
  );
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
  const [editDeadline, setEditDeadline] = useState(task.deadline || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      resetEdit();
      return;
    }

    const updates: Partial<Task> = {};
    if (editTitle !== task.title) {
      updates.title = editTitle;
    }
    if (editDescription !== (task.description || "")) {
      updates.description = editDescription || null;
    }
    if (editStatus !== task.status) {
      updates.status = editStatus;
    }
    if (editDeadline !== (task.deadline || "")) {
      updates.deadline = editDeadline || null;
    }

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(task.id, updates);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const resetEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
    setEditDeadline(task.deadline || "");
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      resetEdit();
    }
  };

  const overdue = isOverdue(task.deadline);
  const isCompleted = task.status === "completed";

  const statusColors = getStatusColor(task.status);

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 border ${
        isCompleted
          ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          : overdue
            ? "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      }`}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header row with status badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => {
                  onUpdate(task.id, {
                    status: isCompleted ? "todo" : "completed",
                  });
                }}
                disabled={isEditing}
                className={`rounded-full mt-1 cursor-pointer transition-colors  ${
                  isCompleted
                    ? "border-none outline-0 data-[state=checked]:text-green-50 data-[state=checked]:dark:text-green-50 data-[state=checked]:bg-green-600 data-[state=checked]:dark:bg-green-600"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
              />

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="px-2 py-1 text-sm font-semibold border border-blue-400 dark:border-blue-600 dark:bg-slate-700 dark:text-white mb-1"
                    placeholder="Task title..."
                  />
                ) : (
                  <div
                    className={`text-sm font-semibold cursor-pointer wrap-break-word transition-colors ${
                      isCompleted
                        ? "text-slate-500 line-through dark:text-slate-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                    onClick={() => setIsEditing(true)}
                  >
                    {task.title}
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors}`}
            >
              {!isEditing ? (
                getStatusLabel(task.status)
              ) : (
                <Select
                  value={editStatus}
                  onValueChange={(value) => setEditStatus(value as TaskStatus)}
                >
                  <SelectTrigger
                    className={
                      "h-6 min-w-[5.5rem] px-2 py-0 text-xs font-semibold rounded-full bg-transparent border-0 shadow-none flex items-center justify-between gap-1 focus:ring-0 outline-none"
                    }
                    size="sm"
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md">
                    <SelectItem value="todo" className="text-slate-600">
                      To Do
                    </SelectItem>

                    <SelectItem
                      value="inProgress"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      In Progress
                    </SelectItem>

                    <SelectItem
                      value="completed"
                      className="text-green-600 dark:text-green-400"
                    >
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Description */}
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add description..."
              rows={2}
              className="w-full px-2 py-1 text-xs border border-blue-400 dark:border-blue-600 dark:bg-slate-700 dark:text-white rounded resize-none"
            />
          ) : task.description ? (
            <p
              className={`text-xs ${
                isCompleted
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-slate-600 dark:text-slate-300"
              } break-words`}
            >
              {task.description}
            </p>
          ) : null}

          {/* Deadline and Meta Info */}
          <div className="flex flex-wrap items-center gap-2">
            {isEditing ? (
              <Input
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="px-2 py-1 text-xs border border-blue-400 dark:border-blue-600 dark:bg-slate-700 dark:text-white rounded"
              />
            ) : task.deadline ? (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  isCompleted
                    ? "text-slate-400 dark:text-slate-500"
                    : overdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.deadline)}</span>
                {overdue && !isCompleted && (
                  <span className="font-bold text-red-600 dark:text-red-400">
                    • Overdue
                  </span>
                )}
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100 dark:border-slate-700">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-2 py-1 h-auto text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  title="Save (Ctrl+Enter)"
                >
                  <Check className="w-3 h-3 mr-1" />
                  <span className="text-xs">Save</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetEdit}
                  disabled={isSaving}
                  className="px-2 py-1 h-auto text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Cancel (Esc)"
                >
                  <X className="w-3 h-3 mr-1" />
                  <span className="text-xs">Cancel</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 h-auto text-slate-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                  className="px-2 py-1 h-auto text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
