# AssignMate 🍵

A clean, matcha-green assignment and task tracker built for students. Manage assignments, track deadlines with live countdowns, and stay focused with a built-in Pomodoro timer.

## Features

- **Auth** — Email/password sign up & login (Supabase Auth), protected routes, "remember me", logout
- **Dashboard** — Totals, completed/pending/overdue counts, due today/this week, weekly completion rate, quick-add
- **Assignments** — Create / edit / delete (with confirmation) / mark complete, with title, description, due date+time, priority, category, optional estimated duration
- **Search, filter, sort** — By title/description, status (All/Active/Completed/Overdue), priority, category; sort by due date, priority, creation date, or A–Z; card or table view
- **Live countdown timers** — Per-assignment countdown that ticks every second and shifts green → yellow → red as the deadline nears
- **Focus Timer** — Pomodoro-style 25/5/15–30 minute cycle, fully customizable, with a progress ring and a chime when time's up
- **Polish** — Responsive layout (desktop sidebar + mobile bottom nav), light/dark mode, toast notifications, loading skeletons, empty states, accessible focus states

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · Zustand · React Router v7 · date-fns · Supabase (Auth + Postgres) · Lucide icons · Sonner toasts

## Project structure

```
assignmate/
├── src/
│   ├── components/
│   │   ├── dashboard/      # StatsCard
│   │   ├── layout/         # Sidebar, MobileNav, Topbar, AppLayout, ProtectedRoute
│   │   ├── tasks/          # TaskCard, TaskList, TaskFilters, TaskFormModal, CountdownBadge
│   │   ├── timer/          # PomodoroTimer
│   │   └── ui/             # ConfirmDialog, EmptyState, Skeleton
│   ├── hooks/               # useCountdown, usePomodoro
│   ├── lib/                 # supabase client
│   ├── pages/               # Login, Register, Dashboard, Tasks, Focus, Settings
│   ├── store/                # authStore, taskStore, uiStore (Zustand)
│   ├── types/                # shared TypeScript types
│   ├── utils/                 # date + priority helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_date timestamptz not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  category text not null default 'General',
  estimated_duration integer,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.tasks enable row level security;

create policy "Users can view their own tasks"
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete using (auth.uid() = user_id);

create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_due_date_idx on public.tasks (due_date);
```

3. Under **Authentication > Providers**, confirm Email is enabled. For local testing, you can disable "Confirm email" under **Authentication > Settings** so accounts are usable immediately after sign-up.
4. Under **Project Settings > API**, copy your **Project URL** and **anon public key**.

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`, create an account, and start adding assignments.

## 4. Build for production

```bash
npm run build
npm run preview   # optional, preview the production build locally
```

The build output is written to `dist/`.

## 5. Deploy

**Vercel**
1. Push this project to a GitHub repo.
2. Import it in Vercel, framework preset "Vite".
3. Add the two `VITE_SUPABASE_*` environment variables in the Vercel project settings.
4. Deploy.

**Netlify**
1. `npm run build`
2. Drag the `dist/` folder into Netlify, or connect the repo with build command `npm run build` and publish directory `dist`.
3. Add the same environment variables under Site settings > Environment variables.

## Design notes

- Background is white (light mode) with a matcha green (`#74a346`) accent used throughout buttons, active nav states, and highlights.
- Typography is set in **Poppins** across all weights.
- Priorities are color-coded: 🔴 High, 🟠 Medium, 🔵 Low.
- Dark mode mirrors the same palette with a deep green-black background, toggled from Settings or the topbar.

## Notes for graders / demo

- All data is scoped per-user via Supabase row-level security — every request is authenticated and filtered by `user_id`.
- The countdown badges and Pomodoro ring are fully client-side and update live every second without any extra network calls.
- If you don't want to wire up Supabase before presenting, you can still walk through every screen's UI/UX — only live data persistence requires the backend.
