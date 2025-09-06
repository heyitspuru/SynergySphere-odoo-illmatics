---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
# 🚀 Copilot Instructions – Refactor HackThisIdea → SynergySphere

## 📌 General Coding & Refactoring Rules
When refactoring or generating code, always follow these rules:
1. *Code Quality*
    - Use *TypeScript* consistently.
    - Keep functions small, modular, and reusable.
    - Use *async/await* for async operations.
    - Apply *DRY principle* (don’t repeat yourself).

2. *Styling & UI*
    - Use *TailwindCSS* with responsive classes.
    - Ensure all components are *mobile-first and responsive*.
    - Use *shadcn/ui components* where possible.
    - Follow *clean UI patterns* (minimal, modern, accessible).

3. *File Organization*
    - Keep models in lib/models/.
    - Keep utility functions in lib/.
    - Keep UI components in components/synergysphere/.
    - Use feature-based folders in app/.

4. *Documentation & Comments*
    - Add JSDoc comments for exported functions/components.
    - Keep code self-explanatory; comment non-obvious logic.

5. *Performance*
    - Optimize queries with MongoDB indexes where needed.
    - Use server-side rendering (Next.js) where appropriate.
    - Minimize API calls by batching when possible.

---

## 🗑 Remove / Deprecate
- /app/events/* → Remove hackathon events.
- /app/idea-generator/* → Remove AI idea generation (Nebius).
- /app/forums/* → Replace with *project discussions*.
- /app/resources/* and /app/help/*.
- Branding: Replace all instances of “HackThisIdea” with “SynergySphere”.

---

## ✅ Keep & Modify
- layout.tsx → Update branding, metadata, and navigation.
- dashboard.tsx → Show *projects overview* instead of hackathons.
- profile/ + settings/ → Keep, connect to real user data.
- lib/mongodb.ts → Keep MongoDB connection.
- components/ui/* → Keep all UI utilities.

---

## 🔹 Phase 1: Core Foundation
*Goal:* Add authentication, user model, navigation.

### Tasks
1. Install dependencies:
    ```bash
    pnpm install next-auth @auth/mongodb-adapter
    ```

Create lib/auth.ts with NextAuth config:

Use MongoDB adapter.

Support email/password credentials.

Store sessions as JWT.

Add roles (user, admin).

Add (auth) pages:

/app/(auth)/login/page.tsx

/app/(auth)/register/page.tsx

Create middleware.ts:

Protect /dashboard, /projects, /tasks, /team.

🔹 Phase 2: Data Models

Create Mongoose models in /lib/models/.

User.ts

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  createdAt: Date
  updatedAt: Date
}


Project.ts

interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  members: string[]
  createdAt: Date
  updatedAt: Date
}


Task.ts

interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  assigneeId?: string
  projectId: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

🔹 Phase 3: API Routes

Add under /app/api/.

/api/auth/* → NextAuth endpoints.

/api/projects/* → CRUD for projects.

/api/tasks/* → CRUD for tasks.

/api/users/* → User management.

/api/notifications/* → Task assignment + due date alerts.

🔹 Phase 4: Pages & Components
Pages
app/
├── dashboard/          → Projects overview
├── projects/
│   ├── page.tsx        → Projects list
│   ├── create/         → Create project
│   ├── [id]/
│   │   ├── page.tsx    → Project detail
│   │   ├── tasks/      → Kanban board
│   │   └── discussions/→ Threaded chat
├── tasks/              → My assigned tasks
├── team/               → Team members

Components

Create in components/synergysphere/:

project-list.tsx

project-detail.tsx

task-board.tsx (Kanban with react-beautiful-dnd)

task-card.tsx

task-form.tsx

project-team.tsx

discussion-thread.tsx

🔹 Phase 5: Enhancements

Notifications: Due dates + task assignment.

Charts: Task progress & member workload.

AI Integration (lib/ai.ts):

generateDailySummary(messages: Message[]) → daily standup.

Overdue task risk detection.

UI Polish:

Dark mode toggle.

Confetti animation for project completion.

PWA support for mobile.