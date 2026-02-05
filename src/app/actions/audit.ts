"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function logEvent(action: string, payload?: any) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized" };

        // Find the internal user ID mapping if needed, or just use clerkId if schema allows
        // For this POC, we'll use the clerkId directly if we haven't run migrations to create the User model.
        // However, the schema expects a relation. Let's assume the User model exists and matches clerkId.

        await db.auditLog.create({
            data: {
                action,
                payload,
                // userId: userId // This assumes the User.id matches clerkId or we've mapped it
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
