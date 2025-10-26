"use client"

import { useState } from "react"
import { useRealTime, type Poll } from "@/context/realtime-context"
import { Heart } from "lucide-react"

interface PollCardProps {
  poll: Poll
}

export default function PollCard({ poll }: PollCardProps) {
  const { votePoll, likePoll, userVotes, userLikes } = useRealTime()
  const [isVoting, setIsVoting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const hasVoted = userVotes.has(poll.id)
  const hasLiked = userLikes.has(poll.id)
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return
    setIsVoting(true)
    await votePoll(poll.id, optionId)
    setIsVoting(false)
  }

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    await likePoll(poll.id)
    setIsLiking(false)
  }

  const createdDate = new Date(poll.createdAt)
  const timeAgo = getTimeAgo(createdDate)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{poll.question}</h3>
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>

      <div className="space-y-3 mb-6">
        {poll.options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
          const isSelected = userVotes.get(poll.id) === option.id

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || isVoting}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : hasVoted
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-blue-300 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{option.text}</span>
                <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{option.votes} votes</p>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
        </div>
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center justify-center gap-2 w-12 h-10 rounded-lg transition-all duration-200 ${
            hasLiked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
          }`}
        >
          <Heart size={18} className={`transition-all duration-200 ${hasLiked ? "fill-current" : ""}`} />
          <span className="text-sm font-medium">{poll.likes}</span>
        </button>
      </div>
    </div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
