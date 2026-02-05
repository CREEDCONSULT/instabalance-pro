# Deployment Guide: InstaBalance Pro on Vercel

Vercel is the recommended way to publish Next.js applications. Follow these steps to take **InstaBalance Pro** live.

## 1. Prepare your GitHub Repo
Ensure all your local changes are pushed to your repository:
```powershell
git add .
git commit -m "docs: finalize deployment guide"
git push origin main
```

## 2. Deploy on Vercel
1.  Go to [Vercel](https://vercel.com/) and log in (use your GitHub account).
2.  Click **Add New...** → **Project**.
3.  Import your `instabalance-pro` repository.
4.  **Crucial Step: Environment Variables**
    Before clicking "Deploy", expand the **Environment Variables** section and add the following keys from your `.env.local`:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (set to `/sign-in`)
    - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (set to `/sign-up`)
    - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (set to `/dashboard`)
    - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (set to `/dashboard`)
    - `DATABASE_URL` (your Neon PostgreSQL URL)
5.  Click **Deploy**.

## 3. Sync Database (Prisma)
Since Vercel is a production environment, you need to ensure the database schema is up to date:
Vercel will automatically run `npm run build`, which includes the Prisma client generation. However, since we used `prisma db push` locally, your Neon database is already in sync. 

> [!NOTE]
> If you ever change the `schema.prisma` file, you should run `npx prisma db push` again locally to update your Neon database before redeploying.

## 4. Configure Clerk Production
1.  Go to your [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Add your new Vercel domain (e.g., `instabalance-pro.vercel.app`) to the **Allowed Redirect Origins** in your Clerk project settings.
3.  Switch your Clerk project from **Development** to **Production** mode if you are ready for real users (this will require moving to a live Clerk instance).

## 5. Mobile PWA Setup
Once deployed, open your Vercel URL on your phone:
- **iOS**: Tap **Share** → **Add to Home Screen**.
- **Android**: Tap the **Three Dots** → **Install App**.

Your app will now look and feel like a native Instagram-style app!
