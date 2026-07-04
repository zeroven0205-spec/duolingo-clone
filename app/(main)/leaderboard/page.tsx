import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import {
  getTopUsersForPeriod,
  getUserProgress,
  getUserSubscription,
  type LeaderboardPeriod,
} from "@/db/queries";

import { PeriodTabs } from "./period-tabs";

const VALID_PERIODS: LeaderboardPeriod[] = ["weekly", "monthly", "all-time"];

function parsePeriod(value: string | string[] | undefined): LeaderboardPeriod {
  const candidate = Array.isArray(value) ? value[0] : value;
  return VALID_PERIODS.includes(candidate as LeaderboardPeriod)
    ? (candidate as LeaderboardPeriod)
    : "all-time";
}

const LeaderboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ period?: string | string[] }>;
}) => {
  const params = await searchParams;
  const period = parsePeriod(params?.period);

  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopUsersForPeriod(period);

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          streak={userProgress.streak}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            排行榜
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            看看你在社区学习者中的排名
          </p>

          <PeriodTabs current={period} />

          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((entry, i) => (
            <div
              key={entry.userId}
              className="flex w-full items-center rounded-xl p-2 px-4 hover:bg-gray-200/50"
            >
              <p className="mr-4 font-bold text-lime-700">{i + 1}</p>

              <Avatar className="ml-3 mr-6 h-12 w-12 border bg-green-500">
                <AvatarImage
                  src={entry.userImageSrc}
                  className="object-cover"
                />
              </Avatar>

              <p className="flex-1 font-bold text-neutral-800">
                {entry.userName}
              </p>
              <p className="text-muted-foreground">{entry.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;