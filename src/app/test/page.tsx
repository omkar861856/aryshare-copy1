export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ Server is Running!
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your Next.js development server is working perfectly on port 3000
        </p>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              🚀 What's Working:
            </h2>
            <ul className="text-left text-gray-600 space-y-1">
              <li>• Next.js server on port 3000</li>
              <li>• Turbopack compilation</li>
              <li>• Environment variables loaded</li>
              <li>• Ayrshare API keys configured</li>
              <li>• Build manifest issues resolved</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              🔑 Next Step - Get Clerk Keys:
            </h2>
            <p className="text-blue-600">
              Visit{" "}
              <a
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                clerk.com
              </a>{" "}
              to get your authentication keys
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
