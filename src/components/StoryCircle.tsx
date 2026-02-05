"use client";

import { Category } from "@/lib/scoring";

interface StoryCircleProps {
    label: string;
    category: Category;
    isActive: boolean;
    count: number;
    onClick: () => void;
}

export default function StoryCircle({ label, category, isActive, count, onClick }: StoryCircleProps) {
    const isSpecial = category === 'PROTECTED' || category === 'LOW_SIGNAL';

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1 shrink-0 group"
        >
            <div className={`w-16 h-16 rounded-full p-[2px] transition ${isActive
                    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
                    : 'bg-zinc-800 group-hover:bg-zinc-700'
                }`}>
                <div className="w-full h-full rounded-full bg-black border-2 border-black flex items-center justify-center overflow-hidden">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs ${category === 'PROTECTED' ? 'bg-blue-500/20 text-blue-500' :
                            category === 'LOW_SIGNAL' ? 'bg-red-500/20 text-red-500' :
                                'bg-zinc-800 text-zinc-400'
                        }`}>
                        {count}
                    </div>
                </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-zinc-500'
                }`}>
                {label}
            </span>
        </button>
    );
}
