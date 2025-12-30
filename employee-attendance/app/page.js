import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Employee Attendance System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Admin portal for managing employee attendance
        </p>

        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition duration-200"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
