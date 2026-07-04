# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Comprehensive roadmap (docs/ROADMAP.md)
- v2.0.0 Engineering Quality plan

## [v2.1.0] - 2026-07-04

### Added
- Streak Celebration overlay (`components/streak-celebration.tsx`) — fires a confetti burst + badge toast at 3 / 7 / 30 / 100 / 365 day milestones
- Streak Freeze / Streak Shield shop items — consume `streakProtectionUntil` on a missed day instead of resetting the streak
- XP Boost shop item — sets `xpBoostUntil` flag for the next lesson
- Extra Hearts Pack shop item — +5 hearts (now allowed above `MAX_HEARTS` for pack-only top-ups)
- `SHOP_CATALOG` constant + `actions/shop.ts` (purchaseStreakFreeze, purchaseStreakShield, purchaseXpBoost, purchaseHeartsPack)
- Leaderboard period tabs — weekly / monthly / all-time, backed by new `getTopUsersForPeriod` query and `pointsWeekly` / `pointsMonthly` counters
- Quest completion celebration — confetti burst + "✓ 完成" badge the first time a milestone quest is reached (per session)

### Changed
- `components/streak-badge.tsx` is now a pure display component with a flame pulse animation; milestone logic moved to `streak-celebration.tsx`
- `components/purchase-celebration.tsx` rewritten on `react-confetti` (the previously-imported `canvas-confetti` package was not installed)
- `actions/user-streak.ts` consumes `streakProtectionUntil` before resetting a streak
- `actions/user-progress.ts:completeLesson` lazily resets weekly / monthly XP counters when stale

### Docs
- Added `docs/deployment/v2.1.0.md` covering schema migration, env vars, business-rule verification, feature flags, monitoring hooks, and rollback plan
- Registered deployment doc in `docs/README.md` index

## [v1.9.0] - 2026-07-02

### Added
- Demo page (`/demo`) for bypassing registration limits
- Locale loader with page reload on switch

### Fixed
- `/privacy`, `/terms` routes now publicly accessible
- i18n language switching now works correctly
- Clerk dev modal hidden via CSS
- Course selection shows toast feedback

### Changed
- Updated middleware with public routes

## [v1.8.0] - 2026-07-02

### Added
- StreakToast component for reward notifications
- StreakBadge component for displaying streak count
- Friends page (`/friends`)
- Friends list component with API
- Friendships data model

### Changed
- UserProgress component includes streak display

## [v1.7.0] - 2026-07-02

### Added
- Merged Clerk and locale middleware
- Analytics library (PostHog integration)

### Fixed
- Middleware/proxy conflict resolved

## [v1.6.0] - 2026-07-02

### Added
- Spaced Repetition algorithm (`lib/spaced-repetition.ts`)
- Web Speech API pronunciation evaluation (`lib/speech评估.ts`)
- User streak action (`actions/user-streak.ts`)
- Word progress schema (`db/schema-word-progress.ts`)
- Review queue API (`app/api/review-queue/route.ts`)

## [v1.5.0] - 2026-07-02

### Added
- Multi-tenant schema (`db/schema-tenant.ts`)
- Teacher dashboard (`app/(main)/teacher/page.tsx`)
- Classroom management API (`app/api/classrooms/route.ts`)

## [v1.4.0] - 2026-07-02

### Added
- PWA manifest (`public/manifest.json`)
- Service worker configuration
- UpdateToast component

### Fixed
- Security hardening

## [v1.2.0] - 2026-07-02

### Added
- PostHog analytics events
- Stripe webhook handling
- Verify script with real commands

### Fixed
- TypeScript errors in Clerk layout
- locale-provider import paths

## [v1.1.0] - 2026-07-01

### Added
- i18n support (English + Chinese)
- sitemap.xml and robots.txt
- Privacy policy and terms of service pages

## [v1.0.0] - 2026-07-01

### Added
- Commercialization baseline
- Cookie banner
- Clerk authentication
- Stripe subscription support
- Course/lesson/challenge system
- Gamification (XP, hearts, streaks, quests, leaderboard)
- Shop with points redemption
