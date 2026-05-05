import { readJSON, writeJSON } from "../utils/file.js";

const FILE_PATH = "./src/data/tasks.json";

export const getTasks = (filters = {}) => {
  let tasks = readJSON(FILE_PATH);

  // Apply filters
  if (filters.status) {
    tasks = tasks.filter((t) => t.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower)),
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    tasks = sortTasks(tasks, filters.sortBy, filters.sortOrder || "asc");
  }

  return tasks;
};

const sortTasks = (tasks, sortBy, sortOrder) => {
  const sorted = [...tasks].sort((a, b) => {
    let compareA = a[sortBy];
    let compareB = b[sortBy];

    if (sortBy === "deadline") {
      compareA = compareA ? new Date(compareA) : new Date("9999-12-31");
      compareB = compareB ? new Date(compareB) : new Date("9999-12-31");
    }

    if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
    if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const addTask = ({ title, description, status, deadline }) => {
  const tasks = readJSON(FILE_PATH);

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description: description || null,
    status: status || "todo",
    deadline: deadline || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeJSON(FILE_PATH, tasks);

  return newTask;
};

export const updateTask = (id, data) => {
  const tasks = readJSON(FILE_PATH);

  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  // Update only allowed fields
  const allowedFields = ["title", "description", "status", "deadline"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (field in data) {
      updates[field] = data[field];
    }
  });

  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  writeJSON(FILE_PATH, tasks);

  return task;
};

export const deleteTask = (id) => {
  const tasks = readJSON(FILE_PATH);
  const newTasks = tasks.filter((t) => t.id !== id);

  if (newTasks.length === tasks.length) return false;

  writeJSON(FILE_PATH, newTasks);
  return true;
};

export const getTaskById = (id) => {
  const tasks = readJSON(FILE_PATH);
  return tasks.find((t) => t.id === id) || null;
};
