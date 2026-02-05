# Architecture Document - InstaBalance Pro

## Technology Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **Backend**: Next.js Server Actions, PostgreSQL (Neon), Prisma ORM.
- **Authentication**: Clerk.
- **Background Jobs**: Upstash QStash/Redis.
- **Monitoring**: Sentry.

## System Boundaries
- **User Provided Data**: The system only interacts with data uploaded by the user.
- **External Links**: The system uses universal links to open the Instagram app.
- **No Direct API**: The system does not use the Instagram Graph API (except for potentially lightweight enrichment if allowed/available).

## Data Model (Proposed)
- `User`: Managed by Clerk.
- `ImportSession`: Tracks each upload event.
- `AccountSnapshot`: Stores normalized data from export files.
- `ReviewDecision`: Stores keep/protect/unfollow decisions.
- `AuditLog`: Tracks system and user actions.
