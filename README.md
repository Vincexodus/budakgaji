<div align="center"><h1>DuitGuard</h1></div>
<div align="center">A centralized real-time fraud detection system for P2P
              transfers (DuitNow), leveraging Open Finance to aggregate bank
              data, proactively detect fraud, alert users pre-transaction, and
              streamline interbank communication. Built with <a href="https://github.com/Kiranism/next-shadcn-dashboard-starter.git">next-shadcn-dashboard-starter</a> </div>

<!-- ## Overview

This is a starter template using the following stack:

- Framework - [Next.js 14](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Auth - [Auth.js](https://authjs.dev/)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io) -->
<!--
## Pages

| Pages                                                                                   | Specifications                                                                                                                      |
| :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| [Signup](https://next-shadcn-dashboard-starter.vercel.app/)                             | Authentication with **NextAuth** supports Social logins and email logins (Enter dummy email for demo).                              |
| [Dashboard](https://next-shadcn-dashboard-starter.vercel.app/dashboard)                 | Cards with recharts graphs for analytics.                                                                                           |
| [Employee](https://next-shadcn-dashboard-starter.vercel.app/dashboard/employee)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs). |
| [Employee/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/employee/new) | A Employee Form with shadcn form (react-hook-form + zod).                                                                           |
| [Product](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product)           | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs   |
| [Product/new](https://next-shadcn-dashboard-starter.vercel.app/dashboard/product/new)   | A Product Form with shadcn form (react-hook-form + zod).                                                                            |
| [Profile](https://next-shadcn-dashboard-starter.vercel.app/dashboard/profile)           | Mutistep dynamic forms using react-hook-form and zod for form validation.                                                           |
| [Kanban Board](https://next-shadcn-dashboard-starter.vercel.app/dashboard/kanban)       | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                              |
| [Not Found](https://next-shadcn-dashboard-starter.vercel.app/dashboard/notfound)        | Not Found Page Added in the root level                                                                                              |
| -                                                                                       | -                                                                                                                                   | -->

## Project Structure

    project-root/
    ├── frontend/
    │   ├── .husky
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   │   └── supabaseClient.ts
    │   ├── pages/
    │   ├── public/
    │   ├── styles/
    │   ├── README.md
    │   ├── next.config.js
    │   ├── package.json
    │   └── tsconfig.json
    ├── models/
    │   └── main.py
    └── README.md

## Frontend Setup

Follow these steps to clone the repository and start the development server:

- `git clone https://github.com/vincexodus/duitguard.git`
- `cd frontend`
- `npm install`
- `npm run dev`

You should now be able to access the application at http://localhost:3000.

## Supabase Setup

Follow these steps to set up Supabase:

- Create a Supabase project at https://supabase.io/
- Add your Supabase URL and key to `frontend/.env.local`
- Run migrations and seeds as needed

## Models Setup

1. Create virtual python environment and activate it

   ```bash
   python -m virtualenv env
   env\Scripts\activate
   ```

2. Download required python modules

   ```bash
   pip install -r requirements.txt
   ```

3. Run server script

   ```bash
   py server.py
   ```
