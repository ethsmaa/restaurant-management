
export default function NotAuthorizedPage() {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">
            You do not have the necessary permissions to view this page.
          </p>
          <a
            href="/ "
            className="text-blue-600 underline hover:text-blue-800"
          >
            buraya tikla
          </a>
        </div>
      </main>
    );
  }
  