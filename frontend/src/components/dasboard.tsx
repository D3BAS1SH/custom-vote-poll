"use client"

import { useState } from "react"
import { useRealTime } from "@/context/realtime-context"
import PollCreator from "./poll-creator"
import PollList from "./poll-list"
import StatsBar from "./stats-bar"
import Header from "./header"

export default function Dashboard() {
  const { polls, loading, error, connected } = useRealTime()
  const [showCreator, setShowCreator] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "likes">("newest")

  const sortedPolls = [...polls].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === "votes") {
      const aVotes = a.options.reduce((sum, opt) => sum + opt.votes, 0)
      const bVotes = b.options.reduce((sum, opt) => sum + opt.votes, 0)
      return bVotes - aVotes
    }
    return b.likes - a.likes
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header connected={connected} />
      <main className="container mx-auto px-4 py-8">
        <StatsBar polls={polls} />

        <div className="mt-8 mb-8">
          <button
            onClick={() => setShowCreator(!showCreator)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            {showCreator ? "Cancel" : "+ Create New Poll"}
          </button>
        </div>

        {showCreator && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <PollCreator onSuccess={() => setShowCreator(false)} />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in duration-300">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6 flex gap-2 flex-wrap">
          {(["newest", "votes", "likes"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                sortBy === sort
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </button>
          ))}
        </div>

        <PollList polls={sortedPolls} loading={loading} />
      </main>
    </div>
  )
}
