"use client"

import type { Poll } from "@/context/realtime-context"
import PollCard from "./poll-card"

interface PollListProps {
  polls: Poll[]
  loading: boolean
}

export default function PollList({ polls, loading }: PollListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-64 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (polls.length === 0) {
    return (
      <div className="text-center py-12 animate-in fade-in duration-500">
        <p className="text-gray-600 text-lg mb-4">No polls yet</p>
        <p className="text-gray-500">Be the first to create a poll and start gathering opinions!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {polls.map((poll, index) => (
        <div key={poll.id} style={{ animationDelay: `${index * 50}ms` }}>
          <PollCard poll={poll} />
        </div>
      ))}
    </div>
  )
}
