"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, Info, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import StoryCircle from "@/components/StoryCircle";
import AccountCard from "@/components/AccountCard";
import { ScoringResult, Category } from "@/lib/scoring";

interface ReviewQueueClientProps {
    initialAccounts: ScoringResult[];
    onSaveDecision: (username: string, decision: any, tier?: string, score?: number, reasons?: string[]) => Promise<any>;
}

export default function ReviewQueueClient({ initialAccounts, onSaveDecision }: ReviewQueueClientProps) {
    const [accounts, setAccounts] = useState<ScoringResult[]>(initialAccounts);
    const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');
    const [completedCount, setCompletedCount] = useState(0);

    const filteredAccounts = useMemo(() => {
        if (activeCategory === 'ALL') return accounts;
        return accounts.filter(a => a.category === activeCategory);
    }, [accounts, activeCategory]);

    const categories = useMemo(() => {
        const counts = accounts.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {} as Record<Category, number>);

        return [
            { label: 'All', category: 'ALL' as const, count: accounts.length },
            { label: 'Low Signal', category: 'LOW_SIGNAL' as const, count: counts['LOW_SIGNAL'] || 0 },
            { label: 'Protected', category: 'PROTECTED' as const, count: counts['PROTECTED'] || 0 },
            { label: 'Inactive', category: 'INACTIVE' as const, count: counts['INACTIVE'] || 0 },
        ];
    }, [accounts]);

    const handleDecision = async (account: ScoringResult, decision: 'KEEP' | 'PROTECT' | 'UNFOLLOW') => {
        // Optimistic UI
        setAccounts(prev => prev.filter(a => a.username !== account.username));
        setCompletedCount(prev => prev + 1);

        // Persist
        await onSaveDecision(
            account.username,
            decision === 'UNFOLLOW' ? 'APPROVE_UNFOLLOW' : decision,
            account.category,
            account.score,
            account.reasons
        );
    };

    const openInstagram = (username: string) => {
        const url = `https://www.instagram.com/${username}/`;
        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-screen-sm mx-auto flex flex-col min-h-[calc(100vh-2rem)]">
                {/* Header */}
                <header className="flex items-center justify-between mb-6 pt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-zinc-900">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-bold italic">Review Queue</h1>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">{completedCount} Reviewed</span>
                    </div>
                </header>

                {/* Categories (Story Circles) */}
                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 sticky top-0 bg-black z-20">
                    {categories.map((cat) => (
                        <StoryCircle
                            key={cat.label}
                            label={cat.label}
                            category={cat.category as Category}
                            isActive={activeCategory === cat.category}
                            count={cat.count}
                            onClick={() => setActiveCategory(cat.category as any)}
                        />
                    ))}
                </div>

                {/* Queue Content */}
                <div className="flex-1 mt-4">
                    {filteredAccounts.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs px-1 uppercase tracking-widest font-bold">
                                <Info className="w-3 h-3" />
                                <span>Next in queue</span>
                            </div>
                            <div className="perspective-1000">
                                <AccountCard
                                    account={filteredAccounts[0]}
                                    onDecision={(d) => handleDecision(filteredAccounts[0], d)}
                                    onOpenInstagram={() => openInstagram(filteredAccounts[0].username)}
                                />
                            </div>

                            {/* Stack Preview */}
                            {filteredAccounts.length > 1 && (
                                <div className="relative mt-[-4rem] -z-10 opacity-50 scale-95 origin-top translate-y-4">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-48" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-4xl">
                                ✨
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Queue Clear!</h3>
                                <p className="text-zinc-500 text-sm mt-1">You've reviewed all accounts in this category.</p>
                            </div>
                            <button
                                onClick={() => setActiveCategory('ALL')}
                                className="text-blue-500 font-bold"
                            >
                                Back to All
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Tips */}
                <footer className="py-8 text-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                        Tap "Unfollow" after clicking "Open" <br />
                        to update your progress manually.
                    </p>
                </footer>
            </div>
        </div>
    );
}
