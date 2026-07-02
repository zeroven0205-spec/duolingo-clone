import { redirect } from "next/navigation";
import { isTeacher } from "@/lib/tenant";

export default async function TeacherPage() {
  const teacher = await isTeacher();

  if (!teacher) {
    redirect("/learn");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Classrooms Card */}
        <a
          href="/teacher/classrooms"
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold mb-2">My Classrooms</h2>
          <p className="text-gray-600">
            View and manage your classrooms, track student progress
          </p>
        </a>

        {/* Assignments Card */}
        <a
          href="/teacher/assignments"
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          <p className="text-gray-600">
            Create and manage homework assignments for your classes
          </p>
        </a>

        {/* Reports Card */}
        <a
          href="/teacher/reports"
          className="block p-6 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p className="text-gray-600">
            View student progress reports and analytics
          </p>
        </a>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Active Classrooms</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Pending Assignments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">0%</div>
            <div className="text-sm text-gray-600">Avg. Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
}
