"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadAndProcess } from "@/app/actions/process";

export default function FileUpload() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleFormAction = async (formData: FormData) => {
        startTransition(async () => {
            const result = await uploadAndProcess(formData);
            if (result.success) {
                // Store result in local storage or state management if needed
                // For now, we'll redirect to review with a query param or similar
                router.push("/dashboard/review");
            }
        });
    };

    return (
        <form action={handleFormAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <label className="block">
                    <span className="sr-only">Choose followers.json</span>
                    <input type="file" name="followers" accept=".json" className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer" />
                </label>
                <label className="block">
                    <span className="sr-only">Choose following.json</span>
                    <input type="file" name="following" accept=".json" className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 cursor-pointer" />
                </label>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
                {isPending ? "Analyzing..." : "Analyze Ratio"}
            </button>
        </form>
    );
}
