export type TaskStatus = "todo" | "inProgress" | "completed";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  deadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
