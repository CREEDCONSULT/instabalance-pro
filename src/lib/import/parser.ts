import { z } from 'zod';

// Minimal schema for followers.json
const FollowerSchema = z.array(z.object({
    string_list_data: z.array(z.object({
        value: z.string(),
        href: z.string().optional(),
        timestamp: z.number().optional()
    }))
}));

// Minimal schema for following.json (can be nested under 'relationships_following')
const FollowingSchema = z.object({
    relationships_following: z.array(z.object({
        string_list_data: z.array(z.object({
            value: z.string(),
            href: z.string().optional(),
            timestamp: z.number().optional()
        }))
    }))
});

export interface InstagramAccount {
    username: string;
    timestamp?: number;
}

export function parseFollowers(jsonContent: any): InstagramAccount[] {
    try {
        const data = FollowerSchema.parse(jsonContent);
        return data.map(item => ({
            username: item.string_list_data[0].value,
            timestamp: item.string_list_data[0].timestamp
        }));
    } catch (error) {
        console.error("Failed to parse followers JSON", error);
        return [];
    }
}

export function parseFollowing(jsonContent: any): InstagramAccount[] {
    try {
        const data = FollowingSchema.parse(jsonContent);
        return data.relationships_following.map(item => ({
            username: item.string_list_data[0].value,
            timestamp: item.string_list_data[0].timestamp
        }));
    } catch (error) {
        // Some exports might have a different top-level key
        console.error("Failed to parse following JSON", error);
        return [];
    }
}

export function computeNonFollowers(followers: InstagramAccount[], following: InstagramAccount[]): string[] {
    const followerUsernames = new Set(followers.map(f => f.username));
    return following
        .filter(f => !followerUsernames.has(f.username))
        .map(f => f.username);
}
