## Recruitment Management Dashboard (ATS)

Modern, responsive Applicant Tracking System (ATS) dashboard built with **Next.js + React + TypeScript + Tailwind CSS**.

### Features

- **Authentication (dummy)**: login with validation + cookie-based session
- **Dashboard**: statistics cards, recent activity, quick actions
- **Jobs**: searchable + filterable table, add/edit/view/delete via modal
- **Candidates Pipeline**: Kanban pipeline with drag & drop between stages
- **Responsive UI**: sidebar/topbar layout for desktop, collapsible sidebar on tablet, hamburger menu on mobile

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Demo Credentials

- Email: `admin@company.com`
- Password: `password123`

### Routes

- `/login`
- `/dashboard`
- `/jobs`
- `/pipeline`

### Notes

- All data is **mocked** and stored client-side (Zustand + local persistence).
- Route protection is implemented at the edge via [src/proxy.ts](src/proxy.ts).

## Build

```bash
npm run build
```
