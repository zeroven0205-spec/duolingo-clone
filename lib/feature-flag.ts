/**
 * Lightweight feature flags backed by environment variables.
 *
 * Default is OFF — feature must be explicitly enabled with `FLAG_<NAME>=on`.
 * This makes new functionality safe to ship behind a flag and easy to roll
 * back without redeploying.
 *
 * Only flags that genuinely need server-side kill-switches belong here.
 * Already-released v2.1.0 features (streak celebration, leaderboard tabs,
 * quest animation) are NOT flagged — rolling those back requires a normal
 * release, not an env var.
 */

export type Flag = "xp_boost" | "shop_v2" | "review_queue";

export function isEnabled(flag: Flag): boolean {
  return process.env[`FLAG_${flag.toUpperCase()}`] === "on";
}