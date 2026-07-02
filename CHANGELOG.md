# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Comprehensive roadmap (docs/ROADMAP.md)
- v2.0.0 Engineering Quality plan

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
