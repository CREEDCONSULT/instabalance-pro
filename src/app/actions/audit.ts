"use server";

import { db } from "@/lib/db";

export async function logEvent(action: string, payload?: any) {
    try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        await db.auditLog.create({
            data: {
                action,
                payload: payload ? (payload as any) : undefined,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to log event:", error);
        return { success: false, error: "Logging failed" };
    }
}

export async function saveDecision(username: string, decision: any, tier?: string, score?: number, reasons?: string[]) {
    try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        await db.reviewDecision.upsert({
            where: {
                userId_username: {
                    userId: userId,
                    username: username
                }
            },
            update: {
                decision,
                tier,
                score,
                reasons
            },
            create: {
                userId,
                username,
                decision,
                tier,
                score,
                reasons
            }
        });

        await logEvent("DECISION_MADE", { username, decision });

        return { success: true };
    } catch (error) {
        console.error("Failed to save decision:", error);
        return { success: false, error: "Save failed" };
    }
}
