"use client";

import { Check, X, ExternalLink, ShieldCheck, Trash2 } from "lucide-react";
import { ScoringResult } from "@/lib/scoring";

interface AccountCardProps {
    account: ScoringResult;
    onDecision: (decision: 'KEEP' | 'PROTECT' | 'UNFOLLOW') => void;
    onOpenInstagram: () => void;
}

export default function AccountCard({ account, onDecision, onOpenInstagram }: AccountCardProps) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                        {account.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">@{account.username}</h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${account.category === 'PROTECTED' ? 'bg-blue-500/10 text-blue-500' :
                                account.category === 'LOW_SIGNAL' ? 'bg-red-500/10 text-red-500' :
                                    'bg-zinc-800 text-zinc-400'
                            }`}>
                            {account.category}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onOpenInstagram}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-zinc-400"
                    title="Open in Instagram"
                >
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                    {account.reasons.map((reason, i) => (
                        <span key={i} className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                            {reason}
                        </span>
                    ))}
                    {account.reasons.length === 0 && (
                        <span className="text-[11px] text-zinc-500 italic">No specific signal detected</span>
                    )}
                </div>

                <div className="pt-2">
                    <div className="w-full bg-zinc-800 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-500 ${account.score > 70 ? 'bg-blue-500' : account.score < 30 ? 'bg-red-500' : 'bg-zinc-600'
                                }`}
                            style={{ width: `${account.score}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                        Signal Strength: {Math.round(account.score)}%
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 divide-x divide-zinc-800">
                <button
                    onClick={() => onDecision('KEEP')}
                    className="py-3 flex flex-col items-center gap-1 hover:bg-green-500/5 transition group"
                >
                    <Check className="w-5 h-5 text-zinc-500 group-hover:text-green-500" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Keep</span>
                </button>
                <button
                    onClick={() => onDecision('PROTECT')}
                    className="py-3 flex flex-col items-center gap-1 hover:bg-blue-500/5 transition group"
                >
                    <ShieldCheck className="w-5 h-5 text-zinc-500 group-hover:text-blue-500" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Protect</span>
                </button>
                <button
                    onClick={() => onDecision('UNFOLLOW')}
                    className="py-3 flex flex-col items-center gap-1 hover:bg-red-500/5 transition group"
                >
                    <Trash2 className="w-5 h-5 text-zinc-500 group-hover:text-red-500" />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Unfollow</span>
                </button>
            </div>
        </div>
    );
}
