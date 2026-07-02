import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// Mock courses data for demo
const mockCourses = [
  { id: 1, title: "Spanish", imageSrc: "/es.svg" },
  { id: 2, title: "French", imageSrc: "/fr.svg" },
  { id: 3, title: "Italian", imageSrc: "/it.svg" },
  { id: 4, title: "Japanese", imageSrc: "/jp.svg" },
  { id: 5, title: "Croatian", imageSrc: "/hr.svg" },
];

export default function DemoPage() {
  // Mock user data for demo
  const demoUser = {
    name: "Demo User",
    streak: 7,
    points: 1250,
    hearts: 4,
    language: "Spanish",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/mascot.svg" alt="Lingo" width={40} height={40} />
            <span className="text-xl font-bold text-green-600">Lingo</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
              Demo Mode
            </span>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-center text-white">
        <p className="text-sm font-medium">
          🎉 You&apos;re viewing a demo of Lingo. Sign up to track your progress!
        </p>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <section className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold">Welcome back, {demoUser.name}!</h1>
          <p className="mb-8 text-gray-600">Continue your {demoUser.language} learning journey</p>

          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4">
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-orange-500">🔥 {demoUser.streak}</div>
              <div className="text-sm text-gray-500">Day Streak</div>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-yellow-500">{demoUser.points}</div>
              <div className="text-sm text-gray-500">Total XP</div>
            </div>
            <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-500">❤️ {demoUser.hearts}</div>
              <div className="text-sm text-gray-500">Hearts Left</div>
            </div>
          </div>
        </section>

        {/* Course Progress */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Your Courses</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <Link
                key={course.id}
                href="/learn"
                className="group rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-4">
                  <Image
                    src={course.imageSrc}
                    alt={course.title}
                    width={48}
                    height={48}
                    className="rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-500">25% complete</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: "25%" }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold">Continue Learning</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/learn"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                📚
              </div>
              <div>
                <div className="font-semibold">Learn</div>
                <div className="text-sm text-gray-500">3 lessons today</div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                🏆
              </div>
              <div>
                <div className="font-semibold">Leaderboard</div>
                <div className="text-sm text-gray-500">Rank #42</div>
              </div>
            </Link>

            <Link
              href="/quests"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                🎯
              </div>
              <div>
                <div className="font-semibold">Quests</div>
                <div className="text-sm text-gray-500">2/5 complete</div>
              </div>
            </Link>

            <Link
              href="/shop"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                💎
              </div>
              <div>
                <div className="font-semibold">Shop</div>
                <div className="text-sm text-gray-500">Use your points</div>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
          <h2 className="mb-2 text-2xl font-bold">Ready to start your journey?</h2>
          <p className="mb-6 text-green-100">
            Create a free account to save your progress and compete with friends!
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-green-600 hover:bg-green-50" asChild>
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button
              variant="ghost"
              className="border-white text-white hover:bg-green-600"
              asChild
            >
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>Lingo - Learn languages for free</p>
          <p className="mt-2">
            <Link href="/privacy-policy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/terms-of-service" className="hover:text-gray-700">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
