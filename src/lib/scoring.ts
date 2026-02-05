export type Category =
    | 'PROTECTED'
    | 'LOW_SIGNAL'
    | 'INACTIVE'
    | 'NEVER_INTERACTED'
    | 'UNKNOWN';

export interface ScoringResult {
    username: string;
    score: number; // 0-100, where 100 is "high value/keep"
    category: Category;
    reasons: string[];
}

export interface ScoringConfig {
    protectedUsernames: string[];
    lowSignalKeywords: string[];
}

const DEFAULT_CONFIG: ScoringConfig = {
    protectedUsernames: [],
    lowSignalKeywords: ['_ad_', 'shop', 'store', 'official', 'bot'],
};

export function scoreAccount(
    username: string,
    config: ScoringConfig = DEFAULT_CONFIG
): ScoringResult {
    const reasons: string[] = [];
    let score = 50; // Baseline
    let category: Category = 'UNKNOWN';

    // Rule 1: Protected Usernames
    if (config.protectedUsernames.includes(username.toLowerCase())) {
        score = 100;
        category = 'PROTECTED';
        reasons.push('User-protected account');
        return { username, score, category, reasons };
    }

    // Rule 2: Low-signal Keywords
    const hasLowSignalKeyword = config.lowSignalKeywords.some(keyword =>
        username.toLowerCase().includes(keyword)
    );
    if (hasLowSignalKeyword) {
        score -= 20;
        reasons.push('Contains low-signal keywords');
    }

    // Rule 3: Heuristics for "bot-like" or "inactive" names
    if (/^[a-z0-9._]{1,4}$/.test(username)) {
        // Very short usernames are often high-value or protected
        score += 10;
        reasons.push('Short/exclusive username');
    }

    if ((username.match(/\d/g) || []).length > 4) {
        // Too many numbers might indicate a generated account
        score -= 15;
        reasons.push('High digit density');
    }

    // Categorization based on final score
    if (score >= 80) category = 'PROTECTED';
    else if (score < 30) category = 'LOW_SIGNAL';
    else category = 'UNKNOWN';

    return { username, score, category, reasons };
}

export function categorizeAccounts(
    usernames: string[],
    config: ScoringConfig = DEFAULT_CONFIG
): ScoringResult[] {
    return usernames.map(u => scoreAccount(u, config));
}
