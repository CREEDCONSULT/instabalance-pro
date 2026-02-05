import { describe, it, expect } from 'vitest';
import { parseFollowers, parseFollowing, computeNonFollowers } from './parser';

describe('Instagram Data Parser', () => {
    const mockFollowers = [
        { string_list_data: [{ value: 'user1', timestamp: 123 }] },
        { string_list_data: [{ value: 'user2', timestamp: 456 }] }
    ];

    const mockFollowing = {
        relationships_following: [
            { string_list_data: [{ value: 'user1', timestamp: 123 }] },
            { string_list_data: [{ value: 'user3', timestamp: 789 }] }
        ]
    };

    it('correctly parses followers', () => {
        const result = parseFollowers(mockFollowers);
        expect(result).toHaveLength(2);
        expect(result[0].username).toBe('user1');
    });

    it('correctly parses following', () => {
        const result = parseFollowing(mockFollowing);
        expect(result).toHaveLength(2);
        expect(result[1].username).toBe('user3');
    });

    it('computes non-followers correctly', () => {
        const followers = parseFollowers(mockFollowers);
        const following = parseFollowing(mockFollowing);
        const nonFollowers = computeNonFollowers(followers, following);
        expect(nonFollowers).toEqual(['user3']);
    });
});
