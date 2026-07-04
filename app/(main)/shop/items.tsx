"use client";

import { useState, useTransition } from "react";

import Image from "next/image";
import { toast } from "sonner";

import { PurchaseCelebration } from "@/components/purchase-celebration";
import { Button } from "@/components/ui/button";
import {
  MAX_HEARTS,
  POINTS_TO_REFILL,
  SHOP_CATALOG,
} from "@/constants";
import {
  purchaseHeartsPack,
  purchaseStreakFreeze,
  purchaseStreakShield,
  purchaseXpBoost,
} from "@/actions/shop";
import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

// Bind item id → server action. The action throws if the user lacks points,
// the component surfaces that via toast.
const PURCHASE_ACTIONS = {
  streak_freeze: purchaseStreakFreeze,
  streak_shield: purchaseStreakShield,
  xp_boost: purchaseXpBoost,
  hearts_pack: purchaseHeartsPack,
} as const;

export const Items = ({
  hearts,
  points,
  hasActiveSubscription,
}: ItemsProps) => {
  const [pending, startTransition] = useTransition();
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [celebrateMessage, setCelebrateMessage] = useState<string | undefined>(
    undefined
  );

  const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;

    startTransition(() => {
      refillHearts().catch(() => toast.error("出了点问题"));
    });
  };

  const onUpgrade = () => {
    toast.loading("正在跳转结账...");
    startTransition(() => {
      createStripeUrl()
        .then((response) => {
          if (response.data) window.location.href = response.data;
        })
        .catch(() => toast.error("出了点问题"));
    });
  };

  const onPurchase = (id: keyof typeof PURCHASE_ACTIONS) => {
    if (pending) return;

    startTransition(async () => {
      const action = PURCHASE_ACTIONS[id];
      const result = await action();
      if (!result.success) {
        toast.error(result.error || "购买失败");
        return;
      }
      toast.success(result.message);
      setCelebrateMessage(result.message);
      setCelebrateKey((k) => k + 1);
    });
  };

  return (
    <>
      <PurchaseCelebration key={celebrateKey} trigger={celebrateKey > 0} message={celebrateMessage} />
      <ul className="w-full">
        {/* Point-redeemable catalog */}
        {SHOP_CATALOG.map((item) => {
          const affordable = points >= item.price;
          return (
            <div
              key={item.id}
              className="flex w-full items-center gap-x-4 border-t-2 p-4"
            >
              <Image
                src={item.icon}
                alt={item.title}
                height={60}
                width={60}
              />

              <div className="flex-1">
                <p className="text-base font-bold text-neutral-700 lg:text-xl">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <Button
                onClick={() => onPurchase(item.id)}
                disabled={pending || !affordable}
                aria-disabled={pending || !affordable}
              >
                {!affordable ? (
                  "积分不足"
                ) : (
                  <div className="flex items-center">
                    <Image
                      src="/points.svg"
                      alt="Points"
                      height={20}
                      width={20}
                    />
                    <p>{item.price}</p>
                  </div>
                )}
              </Button>
            </div>
          );
        })}

        {/* Subscription */}
        <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
          <Image src="/unlimited.svg" alt="Unlimited" height={60} width={60} />

          <div className="flex-1">
            <p className="text-base font-bold text-neutral-700 lg:text-xl">
              无限红心
            </p>
          </div>

          <Button onClick={onUpgrade} disabled={pending} aria-disabled={pending}>
            {hasActiveSubscription ? "设置" : "升级"}
          </Button>
        </div>
      </ul>
    </>
  );
};