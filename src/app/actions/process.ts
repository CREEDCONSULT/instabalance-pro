"use server";

import { parseFollowers, parseFollowing, computeNonFollowers } from "@/lib/import/parser";
import { categorizeAccounts } from "@/lib/scoring";
import { db } from "@/lib/db";

export async function uploadAndProcess(formData: FormData) {
    try {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return { success: false, error: "Unauthorized. Please sign in." };
        }

        const followersFile = formData.get("followers") as File;
        const followingFile = formData.get("following") as File;

        if (!followersFile || !followingFile) {
            return { success: false, error: "Missing files. Both followers.json and following.json are required." };
        }

        const followersContent = await followersFile.text();
        const followingContent = await followingFile.text();

        console.log(`User ${clerkId}: Received files: Followers (${followersContent.length} bytes), Following (${followingContent.length} bytes)`);

        let followersJson, followingJson;
        try {
            followersJson = JSON.parse(followersContent);
            followingJson = JSON.parse(followingContent);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return { success: false, error: "Invalid JSON format. Ensure you are uploading original Instagram export files." };
        }

        const followers = parseFollowers(followersJson);
        const following = parseFollowing(followingJson);

        console.log(`Parsed: ${followers.length} followers, ${following.length} following`);

        if (followers.length === 0 || following.length === 0) {
            return { success: false, error: "Could not find account data in files. Check if these are the correct JSON files." };
        }

        const nonFollowers = computeNonFollowers(followers, following);
        const analysis = categorizeAccounts(nonFollowers);

        console.log(`Analysis complete: ${analysis.length} non-followers found.`);

        // 1. Ensure User exists in our DB
        const user = await db.user.upsert({
            where: { clerkId },
            update: {},
            create: { clerkId }
        });

        // 2. Create ImportSession and store result
        const session = await db.importSession.create({
            data: {
                userId: user.id,
                status: 'COMPLETED',
                followerCount: followers.length,
                followingCount: following.length,
                rawData: analysis as any // Cast to any for JSON storage
            }
        });

        return { success: true, sessionId: session.id };
    } catch (error: any) {
        console.error("Upload process crash:", error);
        return { success: false, error: "An unexpected error occurred: " + (error.message || "Unknown error") };
    }
}
