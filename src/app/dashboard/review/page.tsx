import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ReviewQueueClient from "@/components/ReviewQueueClient";
import { ScoringResult } from "@/lib/scoring";
import { saveDecision } from "@/app/actions/audit";

export default async function ReviewPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        redirect("/");
    }

    const session = await db.importSession.findFirst({
        where: { user: { clerkId } },
        orderBy: { createdAt: 'desc' },
    });

    if (!session) {
        redirect("/dashboard/import");
    }

    const accounts = session.rawData as any as ScoringResult[];

    return <ReviewQueueClient initialAccounts={accounts} onSaveDecision={saveDecision} />;
}
