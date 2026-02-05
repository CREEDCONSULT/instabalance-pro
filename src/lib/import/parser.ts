import { z } from 'zod';

// Minimal schema for followers.json
const FollowerSchema = z.union([
    z.array(z.object({
        string_list_data: z.array(z.object({
            value: z.string(),
            href: z.string().optional(),
            timestamp: z.number().optional()
        }))
    })),
    // Alternative format sometimes seen
    z.object({
        followers: z.array(z.object({
            string_list_data: z.array(z.object({
                value: z.string(),
                timestamp: z.number().optional()
            }))
        }))
    })
]);

// Minimal schema for following.json
const FollowingSchema = z.union([
    z.object({
        relationships_following: z.array(z.object({
            string_list_data: z.array(z.object({
                value: z.string(),
                href: z.string().optional(),
                timestamp: z.number().optional()
            }))
        }))
    }),
    // Alternative format
    z.array(z.object({
        string_list_data: z.array(z.object({
            value: z.string(),
            timestamp: z.number().optional()
        }))
    }))
]);

export interface InstagramAccount {
    username: string;
    timestamp?: number;
}

export function parseFollowers(jsonContent: any): InstagramAccount[] {
    try {
        const result = FollowerSchema.safeParse(jsonContent);
        if (!result.success) {
            console.error("Follower validation failed:", result.error.format());
            // Fallback for extreme cases
            if (Array.isArray(jsonContent)) {
                return jsonContent.map((item: any) => ({
                    username: item.string_list_data?.[0]?.value || "unknown",
                    timestamp: item.string_list_data?.[0]?.timestamp
                }));
            }
            return [];
        }

        const data = result.data;
        const list = Array.isArray(data) ? data : data.followers;

        return list.map(item => ({
            username: item.string_list_data[0].value,
            timestamp: item.string_list_data[0].timestamp
        }));
    } catch (error) {
        console.error("Critical error parsing followers JSON", error);
        return [];
    }
}

export function parseFollowing(jsonContent: any): InstagramAccount[] {
    try {
        const result = FollowingSchema.safeParse(jsonContent);
        if (!result.success) {
            console.error("Following validation failed:", result.error.format());
            if (Array.isArray(jsonContent)) {
                return jsonContent.map((item: any) => ({
                    username: item.string_list_data?.[0]?.value || "unknown",
                    timestamp: item.string_list_data?.[0]?.timestamp
                }));
            }
            return [];
        }

        const data = result.data;
        const list = Array.isArray(data) ? data : data.relationships_following;

        return list.map(item => ({
            username: item.string_list_data[0].value,
            timestamp: item.string_list_data[0].timestamp
        }));
    } catch (error) {
        console.error("Critical error parsing following JSON", error);
        return [];
    }
}

export function computeNonFollowers(followers: InstagramAccount[], following: InstagramAccount[]): string[] {
    const followerUsernames = new Set(followers.map(f => f.username));
    return following
        .filter(f => !followerUsernames.has(f.username))
        .map(f => f.username);
}
