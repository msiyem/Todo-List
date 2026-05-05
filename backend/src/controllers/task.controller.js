import * as TaskService from "../services/task.service.js";

// Validation helper
const validateTaskInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate && !data.title?.trim()) {
    errors.push("Title is required");
  } else if (isUpdate && data.title !== undefined && !data.title?.trim()) {
    errors.push("Title cannot be empty");
  }

  if (data.title && data.title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  if (data.description && data.description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  if (
    data.status &&
    !["todo", "inProgress", "completed"].includes(data.status)
  ) {
    errors.push('Status must be one of: "todo", "inProgress", "completed"');
  }

  if (data.deadline && isNaN(new Date(data.deadline).getTime())) {
    errors.push("Invalid deadline date format");
  }

  return errors;
};

export const getAllTasks = (req, res) => {
  try {
    const { status, search, sortBy, sortOrder } = req.query;
    const filters = {};

    if (status) {
      if (!["todo", "inProgress", "completed"].includes(status)) {
        return res.status(400).json({
          message:
            'Invalid status. Must be one of: "todo", "inProgress", "completed"',
        });
      }
      filters.status = status;
    }

    if (search) {
      filters.search = search;
    }

    if (sortBy) {
      const validSortFields = ["title", "status", "deadline", "createdAt"];
      if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({
          message: `Invalid sortBy. Must be one of: ${validSortFields.join(", ")}`,
        });
      }
      filters.sortBy = sortBy;
    }

    if (sortOrder) {
      if (!["asc", "desc"].includes(sortOrder)) {
        return res.status(400).json({
          message: 'Invalid sortOrder. Must be "asc" or "desc"',
        });
      }
      filters.sortOrder = sortOrder;
    }

    const tasks = TaskService.getTasks(filters);
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTaskById = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = TaskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const createTask = (req, res) => {
  try {
    const { title, description, status, deadline } = req.body;

    // Validate input
    const errors = validateTaskInput({ title, description, status, deadline });
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join("; ") });
    }

    const task = TaskService.addTask({
      title,
      description,
      status,
      deadline,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Validate input
    const errors = validateTaskInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join("; ") });
    }

    const updated = TaskService.updateTask(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const success = TaskService.deleteTask(id);

    if (!success) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
