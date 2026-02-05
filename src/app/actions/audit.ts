"use server";

import { db } from "@/lib/db";

export async function logEvent(action: string, payload?: any) {
    try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId: clerkId } = await auth();
        if (!clerkId) return { success: false, error: "Unauthorized" };

        // Find the internal user
        const user = await db.user.findUnique({ where: { clerkId } });

        await db.auditLog.create({
            data: {
                action,
                userId: user?.id,
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
        const { userId: clerkId } = await auth();
        if (!clerkId) return { success: false, error: "Unauthorized" };

        // Find the internal user ID
        const user = await db.user.findUnique({ where: { clerkId } });
        if (!user) {
            console.error("User not found for clerkId:", clerkId);
            return { success: false, error: "User session not found. Please try uploading your data again." };
        }

        await db.reviewDecision.upsert({
            where: {
                userId_username: {
                    userId: user.id,
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
                userId: user.id,
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
