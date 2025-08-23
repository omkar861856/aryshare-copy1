import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl mx-auto">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">Welcome to Ayrshare Copy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            A Next.js application with Clerk authentication
          </p>
        </div>

        <SignedOut>
          <div className="text-center space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold mb-2">Get Started</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sign in or create an account to access the full application.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="w-full space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold mb-2">🎉 Welcome Back!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You&apos;re successfully authenticated. You can now access all
                features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• View your profile</li>
                  <li>• Access protected routes</li>
                  <li>• Manage your account</li>
                </ul>
                <div className="mt-4">
                  <a
                    href="/dashboard"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Explore the dashboard</li>
                  <li>• Configure settings</li>
                  <li>• Start building features</li>
                </ul>
              </div>
            </div>
          </div>
        </SignedIn>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://clerk.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Clerk Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Next.js Docs
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://clerk.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Clerk.com →
        </a>
      </footer>
    </div>
  );
}
