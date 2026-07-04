export const POINTS_TO_REFILL = 10;

export const MAX_HEARTS = 5;

export const DAY_IN_MS = 86_400_000;
export const WEEK_IN_MS = 7 * DAY_IN_MS;
export const MONTH_IN_MS = 30 * DAY_IN_MS;

export const QUESTS = [
  {
    title: "Earn 20 XP",
    value: 20,
  },
  {
    title: "Earn 50 XP",
    value: 50,
  },
  {
    title: "Earn 100 XP",
    value: 100,
  },
  {
    title: "Earn 250 XP",
    value: 250,
  },
  {
    title: "Earn 500 XP",
    value: 500,
  },
  {
    title: "Earn 1000 XP",
    value: 1000,
  },
];

export type ShopItemId =
  | "streak_freeze"
  | "streak_shield"
  | "xp_boost"
  | "hearts_pack";

export interface ShopItem {
  id: ShopItemId;
  title: string;
  description: string;
  price: number;
  icon: string;
}

/**
 * Catalog of point-redeemable items shown in /shop.
 * `icon` is a path under /public (e.g. "/heart.svg").
 */
export const SHOP_CATALOG: ShopItem[] = [
  {
    id: "streak_freeze",
    title: "Streak Freeze",
    description: "Protect your streak for 1 missed day.",
    price: 100,
    icon: "/streak.svg",
  },
  {
    id: "streak_shield",
    title: "Streak Shield",
    description: "Protect your streak for 7 missed days.",
    price: 200,
    icon: "/streak.svg",
  },
  {
    id: "xp_boost",
    title: "XP Boost",
    description: "Earn 2× XP on your next lesson.",
    price: 150,
    icon: "/points.svg",
  },
  {
    id: "hearts_pack",
    title: "Extra Hearts Pack",
    description: "Instant +5 hearts.",
    price: 50,
    icon: "/heart.svg",
  },
];