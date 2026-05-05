const BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/tasks";

export const API = {
  getTasks: async (filters?: {
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
    }

    const url = params.toString()
      ? `${BASE_URL}?${params.toString()}`
      : BASE_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  getTaskById: async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch task");
    return res.json();
  },

  addTask: async (data: {
    title: string;
    description?: string | null;
    status?: string;
    deadline?: string | null;
  }) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        status: data.status || "todo",
      }),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  },

  updateTask: async (id: number, data: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  },

  deleteTask: async (id: number) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
  },
};
