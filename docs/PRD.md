# Product Requirement Document - InstaBalance Pro

## Overview
InstaBalance Pro is a mobile-first PWA designed to help users manage their Instagram followers and following lists. It focuses on identifying non-followers and providing a streamlined review process to unfollow accounts manually via deep links to the Instagram app.

## Core Features
1. **Clerk Authentication**: Secure user sign-in.
2. **Export File Ingestion**: Upload `following.json` and `followers.json` from Instagram's "Download Your Information" feature.
3. **Analysis & Categorization**:
    - Identify non-followers.
    - Categorize accounts (e.g., Inactive, Never Interacted, Protected).
4. **Instagram-Native UI**:
    - Story circles for category selection.
    - Account cards with details and "Open in Instagram" deep links.
    - Swipe review queue (Keep / Protect / Approve).
5. **Progress Tracking**: Real-time counter updates in-app after clicking deep links.
6. **Batch Export**: Export reviewed lists to CSV for reference.

## Constraints
- No Instagram credential collection.
- No automated unfollowing or scraping.
- Compliance with Instagram's terms of service.
