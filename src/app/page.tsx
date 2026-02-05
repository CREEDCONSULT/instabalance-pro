import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tighter italic bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent pb-2">
          InstaBalance Pro
        </h1>
        <p className="text-xl text-zinc-400">
          Clean your feed. Balance your ratio.
          The safe way to manage your Instagram connections.
        </p>

        <div className="flex flex-col gap-4 pt-8">
          <SignUpButton mode="modal">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg transition duration-200">
              Get Started for Free
            </button>
          </SignUpButton>

          <SignInButton mode="modal">
            <button className="text-zinc-400 hover:text-white font-semibold transition duration-200">
              Already have an account? Sign In
            </button>
          </SignInButton>
        </div>

        <div className="pt-12 text-sm text-zinc-500">
          <p>No password needed. Powered by Clerk.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
