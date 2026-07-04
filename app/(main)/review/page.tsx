import Image from "next/image";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { auth } from "@clerk/nextjs/server";
import { eq, asc } from "drizzle-orm";

import db from "@/db/drizzle";
import { userWords } from "@/db/schema-word-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { isEnabled } from "@/lib/feature-flag";
import { ReviewSession } from "@/components/review-session";

const ReviewPage = async () => {
  if (!isEnabled("review_queue")) {
    redirect("/learn");
  }

  const { userId } = await auth();
  if (!userId) redirect("/");

  const [userProgress, userSubscription] = await Promise.all([
    getUserProgress(),
    getUserSubscription(),
  ]);

  if (!userProgress || !userProgress.activeCourse) redirect("/courses");

  const now = new Date();
  const allWords = await db.query.userWords.findMany({
    where: eq(userWords.userId, userId),
    orderBy: [asc(userWords.nextReview)],
  });

  const wordsForReview = allWords.filter(
    (w) => new Date(w.nextReview) <= now
  );
  const newWords = allWords.filter(
    (w) => w.box === 0 && new Date(w.nextReview) > now
  );
  const queue = [...wordsForReview, ...newWords].slice(0, 10);

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
      </StickyWrapper>

      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/quests.svg" alt="Review" height={90} width={90} />

          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            复习
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            到期单词按间隔重复算法重新出现，巩固记忆
          </p>

          {queue.length === 0 ? (
            <div className="rounded-xl border-2 bg-white p-8 text-center">
              <p className="text-base font-bold text-neutral-700">
                目前没有需要复习的单词 🎉
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                完成几节课后，复习队列会自动填充。
              </p>
            </div>
          ) : (
            <ReviewSession
              initialQueue={queue.map((w) => ({
                id: w.id,
                word: w.word,
                translation: w.translation,
                box: w.box,
                isNew: w.box === 0,
              }))}
              dueCount={wordsForReview.length}
              newCount={newWords.length}
            />
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ReviewPage;