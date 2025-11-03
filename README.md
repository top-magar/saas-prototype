# SaaS Prototype

A multi-tenant SaaS application built with Next.js, featuring user management, product catalog, order processing, and analytics.

## Features

- **Multi-tenant Architecture** - Isolated data per tenant
- **Authentication** - Clerk integration with role-based access
- **Product Management** - CRUD operations with categories and variants
- **Order Processing** - Complete order lifecycle management
- **Analytics Dashboard** - Revenue, customer, and product insights
- **Payment Integration** - eSewa, Khalti, Fonepay support
- **API Management** - Webhooks, workflows, and API keys
- **Responsive Design** - Mobile-first UI with dark mode

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **UI:** Tailwind CSS + shadcn/ui
- **Payments:** Multiple Nepalese payment gateways
- **Deployment:** Vercel-ready

## Quick Start

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd saas-prototype
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Add your database and Clerk credentials
   ```

3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Main application
│   ├── (marketing)/    # Landing pages
│   └── api/            # API routes
├── components/         # Reusable UI components
├── lib/               # Utilities and configurations
└── hooks/             # Custom React hooks
```

## Environment Variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

## License

MIT