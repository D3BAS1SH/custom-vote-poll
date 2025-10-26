"use client"

import type { Poll } from "@/context/realtime-context"

interface StatsBarProps {
  polls: Poll[]
}

export default function StatsBar({ polls }: StatsBarProps) {
  const totalPolls = polls.length
  const totalVotes = polls.reduce((sum, poll) => sum + poll.options.reduce((optSum, opt) => optSum + opt.votes, 0), 0)
  const totalLikes = polls.reduce((sum, poll) => sum + poll.likes, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4">
        <p className="text-sm text-blue-600 font-medium mb-2">Total Polls</p>
        <p className="text-4xl font-bold text-blue-900">{totalPolls}</p>
      </div>
      <div
        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        style={{ animationDelay: "100ms" }}
      >
        <p className="text-sm text-purple-600 font-medium mb-2">Total Votes</p>
        <p className="text-4xl font-bold text-purple-900">{totalVotes}</p>
      </div>
      <div
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-right-4"
        style={{ animationDelay: "200ms" }}
      >
        <p className="text-sm text-red-600 font-medium mb-2">Total Likes</p>
        <p className="text-4xl font-bold text-red-900">{totalLikes}</p>
      </div>
    </div>
  )
}
