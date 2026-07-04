# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Comprehensive roadmap (docs/ROADMAP.md)
- v2.0.0 Engineering Quality plan
- v2.2.0 plan (`docs/plans/active/v2.2.0-content-and-cleanup.md`) — first-principles scope reduction; closes v2.1.0 debt + wires up half-built features (review queue, spaced repetition, i18n audit). 4.5 人日.

### Changed
- `docs/ROADMAP.md` rewritten — no commitments beyond v2.2.0; future versions gated on data-driven decision triggers

## [v2.2.0] - 2026-07-04

### Added
- `lib/feature-flag.ts` — lightweight flag framework backed by env vars (default OFF)
- `app/(main)/review/page.tsx` + `components/review-session.tsx` — review queue UI (gated by `FLAG_REVIEW_QUEUE`)
- `scripts/check-i18n.ts` — CI-friendly key consistency check between `messages/en.json` and `messages/zh.json` (wired into `pnpm check-i18n`)

### Fixed
- XP Boost now actually awards 2× XP on the next challenge completion and consumes `xpBoostUntil` (was writing the field but never reading it; correct injection point is `actions/challenge-progress.ts`, not `completeLesson`)
- Hearts Pack purchase is now refused when `hearts === MAX_HEARTS` and the cap no longer silently inflates past `MAX_HEARTS`
- PWA service worker now actually caches content — added `runtimeCaching` for fonts / static assets / course APIs / images in `next.config.ts` (previously SW registered but cached nothing, so offline = blank page)

### Changed
- `lib/speech评估.ts` → `lib/speech-evaluation.ts`; interfaces `Speech评估结果` / `Speech评估选项` → `SpeechEvalResult` / `SpeechEvalOptions` (pure rename, no logic change)
- `app/(main)/shop/items.tsx` — Hearts Pack button now shows "已满" when full and is disabled
- `actions/shop.ts` — `shop_v2` feature flag short-circuits all purchases; success path now emits `shop_item_purchased` PostHog event
- `actions/user-streak.ts` — emits `streak_freeze_consumed` and `streak_milestone_reached` PostHog events
- `components/review-session.tsx` — shows spaced-repetition box label via `getBoxLabel` instead of raw `Box N`
- `components/user-progress.tsx` — adds "📚" link to `/review`
- `messages/en.json` / `messages/zh.json` — removed unused `Footer` namespace (orphan translations)

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
