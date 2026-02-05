import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* Top Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-black border-b border-zinc-800">
                <h1 className="text-xl font-bold tracking-tight italic">InstaBalance Pro</h1>
                <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6" />
                    <PlusSquare className="w-6 h-6" />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pb-16">
                <div className="max-w-screen-sm mx-auto p-4">
                    {/* Story Circles Placeholder */}
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black border-2 border-black flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800" />
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-400">Category {i}</span>
                            </div>
                        ))}
                    </div>

                    {/* Welcome Card */}
                    <div className="mt-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                        <h2 className="text-2xl font-bold mb-2">Welcome to InstaBalance</h2>
                        <p className="text-zinc-400 mb-6">
                            Start by uploading your Instagram export files to analyze your non-followers.
                        </p>
                        <Link
                            href="/dashboard/import"
                            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center py-3">
                <Link href="/dashboard"><Home className="w-6 h-6" /></Link>
                <Link href="/dashboard/search"><Search className="w-6 h-6 text-zinc-400" /></Link>
                <Link href="/dashboard/create"><PlusSquare className="w-6 h-6 text-zinc-400" /></Link>
                <Link href="/dashboard/activity"><Heart className="w-6 h-6 text-zinc-400" /></Link>
                <Link href="/dashboard/profile"><User className="w-6 h-6 text-zinc-400" /></Link>
            </nav>
        </div>
    );
}
