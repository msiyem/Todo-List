# Task Manager

A modern full-stack task management application with real-time CRUD operations, advanced filtering, and a beautiful user interface.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 

### Installation

```bash
# Backend setup
cd backend
npm install
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

Access the app at `http://localhost:3000`

## 📋 Features

- **Task Management** - Create, read, update, and delete tasks
- **Advanced Filtering** - Search, sort, and filter by status
- **Progress Tracking** - Real-time completion percentage
- **Kanban Board** - Organize tasks across To Do, In Progress, and Completed columns
- **Dark Mode** - Seamless theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Overdue Detection** - Automatic highlighting of overdue tasks
- **Inline Editing** - Edit tasks directly with keyboard shortcuts (Ctrl+Enter to save, Esc to cancel)

## 🏗️ Architecture

```
task-manager/
├── backend/          # Express API
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── data/
│   │   └── utils/
│   └── package.json
├── frontend/         # Next.js + TypeScript + Shadcn Ui
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
```

## 🛠️ Tech Stack

**Backend:** Node.js, Express, JSON (file-based storage)  
**Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI  
**UI Components:** shadcn/ui

## 📌 API Endpoints

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| GET    | `/tasks`     | Fetch all tasks with filters |
| POST   | `/tasks`     | Create new task              |
| PUT    | `/tasks/:id` | Update task                  |
| DELETE | `/tasks/:id` | Delete task                  |

**Query Parameters:** `status`, `search`, `sortBy`, `sortOrder`

## 📝 License

MIT

Comprehensive error handling for:

- Missing required fields
- Invalid data types
- Field length validation
- Date format validation
- Task not found errors
- File I/O errors

## Code Quality & Best Practices

✅ **Backend Practices**

- Modular architecture (routes, controllers, services, utils)
- Input validation at controller level
- Error handling with appropriate HTTP status codes
- Clean separation of concerns
- RESTful API design

✅ **Frontend Practices**

- Component-based architecture
- React hooks for state management
- TypeScript for type safety
- Proper error handling and user feedback
- Responsive UI with Tailwind CSS
- Keyboard accessibility

✅ **General Practices**

- Clear code structure
- Meaningful variable names
- Comments where necessary
- Consistent code formatting

## Testing

Manual API testing has been performed for:

- ✅ GET all tasks
- ✅ GET tasks with status filter
- ✅ GET tasks with search
- ✅ GET tasks with sorting
- ✅ POST new task (create)
- ✅ PUT update task
- ✅ Input validation


## Project Structure

```
task03/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controllers/
│   │   │   └── task.controller.js
│   │   ├── routes/
│   │   │   └── task.routes.js
│   │   ├── services/
│   │   │   └── task.service.js
│   │   ├── utils/
│   │   │   └── file.js
│   │   └── data/
│   │       └── tasks.json
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── TaskCard.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       └── input.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── task.ts
│   ├── package.json
│   └── tsconfig.json
```

## License

This project is created as part of Task03 assignment.
