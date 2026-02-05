"use server";

import { parseFollowers, parseFollowing, computeNonFollowers } from "@/lib/import/parser";
import { categorizeAccounts } from "@/lib/scoring";

export async function uploadAndProcess(formData: FormData) {
    try {
        const followersFile = formData.get("followers") as File;
        const followingFile = formData.get("following") as File;

        if (!followersFile || !followingFile) {
            return { success: false, error: "Missing files" };
        }

        const followersContent = await followersFile.text();
        const followingContent = await followingFile.text();

        const followers = parseFollowers(JSON.parse(followersContent));
        const following = parseFollowing(JSON.parse(followingContent));

        const nonFollowers = computeNonFollowers(followers, following);
        const analysis = categorizeAccounts(nonFollowers);

        // TODO: Store in DB
        // For now, we'll store in a global singleton or just return it (limited by redirect)
        // In a real app, we'd use a session ID or similar

        // We can't easily pass 10k accounts in a redirect, 
        // but we can store them in a temporary global for this demo 
        // or just return success and let the client fetch from an API route.

        (global as any).lastAnalysis = analysis;

        return { success: true };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, error: "Processing failed" };
    }
}
