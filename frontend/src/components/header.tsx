"use client"

export default function Header({ connected }: { connected: boolean }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            PollHub
          </h1>
          <p className="text-gray-600 text-sm">Real-time polling platform</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              connected
                ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"
                : "bg-red-500 shadow-lg shadow-red-500/50"
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors duration-300 ${
              connected ? "text-green-600" : "text-red-600"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  )
}
