# Project Overview

This is a multi-tenant SaaS platform built with Next.js, Prisma, and Clerk. The application provides a foundation for building a variety of multi-tenant applications.

**Key Technologies:**

*   **Framework:** Next.js
*   **Database:** PostgreSQL with Prisma ORM
*   **Authentication:** Clerk
*   **UI:** Radix UI components
*   **Styling:** Tailwind CSS

**Architecture:**

The application follows a standard Next.js project structure. It uses a multi-tenant architecture where each tenant has its own data isolated in the database. The `prisma/schema.prisma` file defines the database schema, which includes models for `Tenant`, `User`, `Product`, `Order`, and more.

# Building and Running

**1. Install Dependencies:**

```bash
npm install
```

**2. Set up Environment Variables:**

Create a `.env` file in the root of the project and add the following environment variables:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Clerk Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**3. Run Database Migrations:**

```bash
npx prisma migrate dev
```

**4. Seed the Database (Optional):**

```bash
npx prisma db seed
```

**5. Run the Development Server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Development Conventions

*   **Linting:** The project uses ESLint for code linting. Run `npm run lint` to check for linting errors.
*   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
*   **Components:** Reusable UI components are located in the `src/components/ui` directory.
*   **API Routes:** API routes are located in the `src/app/api` directory.
*   **Authentication:** Authentication is handled by Clerk. Use the `@clerk/nextjs` library to access user information.
*   **Database:** The database schema is defined in `prisma/schema.prisma`. Use Prisma Client to interact with the database.
