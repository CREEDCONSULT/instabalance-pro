import { describe, it, expect } from 'vitest';
import { scoreAccount, categorizeAccounts } from './scoring';

describe('Scoring Engine', () => {
    it('protects specified usernames', () => {
        const result = scoreAccount('elonmusk', {
            protectedUsernames: ['elonmusk'],
            lowSignalKeywords: []
        });
        expect(result.category).toBe('PROTECTED');
        expect(result.score).toBe(100);
    });

    it('identifies low-signal accounts by keywords', () => {
        const result = scoreAccount('official_bot_store');
        expect(result.reasons).toContain('Contains low-signal keywords');
        expect(result.score).toBeLessThan(50);
    });

    it('penalizes high digit density', () => {
        const result = scoreAccount('user123456');
        expect(result.reasons).toContain('High digit density');
        expect(result.score).toBeLessThan(50);
    });

    it('categorizes multiple accounts correctly', () => {
        const results = categorizeAccounts(['friend_account', 'bot_123456']);
        expect(results).toHaveLength(2);
        expect(results[0].category).toBe('UNKNOWN');
        expect(results[1].category).toBe('LOW_SIGNAL');
    });
});
