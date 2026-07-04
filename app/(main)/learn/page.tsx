import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { StreakToast } from "@/components/streak-toast";
import { StreakCelebration } from "@/components/streak-celebration";
import { UserProgress } from "@/components/user-progress";
import { updateStreakAndClaimRewards } from "@/actions/user-streak";
import {
  getCourseProgress,
  getLessonPercentage,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Header } from "./header";
import { Unit } from "./unit";

const LearnPage = async () => {
  const [
    userProgressData,
    courseProgressData,
    lessonPercentageData,
    unitsData,
    userSubscriptionData,
    streakResult,
  ] = await Promise.all([
    getUserProgress(),
    getCourseProgress(),
    getLessonPercentage(),
    getUnits(),
    getUserSubscription(),
    updateStreakAndClaimRewards(),
  ]);

  const userProgress = userProgressData;
  const units = unitsData;
  const courseProgress = courseProgressData;
  const lessonPercentage = lessonPercentageData;
  const userSubscription = userSubscriptionData;

  if (!courseProgress || !userProgress || !userProgress.activeCourse)
    redirect("/courses");

  const isPro = !!userSubscription?.isActive;

  return (
    <>
      <StreakToast streakResult={streakResult} />
      <StreakCelebration streak={userProgress.streak} />
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
          <Header title={userProgress.activeCourse.title} />
          {units.map((unit) => (
            <div key={unit.id} className="mb-10">
              <Unit
                id={unit.id}
                order={unit.order}
                description={unit.description}
                title={unit.title}
                lessons={unit.lessons}
                activeLesson={courseProgress.activeLesson}
                activeLessonPercentage={lessonPercentage}
              />
            </div>
          ))}
        </FeedWrapper>
      </div>
    </>
  );
};

export default LearnPage;
