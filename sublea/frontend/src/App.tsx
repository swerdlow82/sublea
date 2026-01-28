import ServerStatus from './components/ServerStatus';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sublea
          </h1>
          <p className="text-gray-600">
            Sublease marketplace for college students
          </p>
        </div>

        {/* Server Connection Status */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Backend Connection
          </h2>
          <ServerStatus />
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Development Status
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">-</span>
              <span>Frontend scaffolding complete (Vite + React + TypeScript)</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">-</span>
              <span>Tailwind CSS v4 configured</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">-</span>
              <span>API client with axios interceptors</span>
            </div>
            <div className="flex items-start">
              <span className="text-yellow-500 mr-2">-</span>
              <span>Waiting for backend routes implementation</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;