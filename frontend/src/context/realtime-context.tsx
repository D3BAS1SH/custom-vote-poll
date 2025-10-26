"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import io, { type Socket } from "socket.io-client"

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  options: PollOption[]
  likes: number
  createdAt: string
}

interface RealTimeContextType {
  polls: Poll[]
  loading: boolean
  error: string | null
  connected: boolean
  userVotes: Map<string, string>
  userLikes: Set<string>
  createPoll: (question: string, options: string[]) => Promise<void>
  votePoll: (pollId: string, optionId: string) => Promise<void>
  likePoll: (pollId: string) => Promise<void>
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined)

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [userVotes, setUserVotes] = useState<Map<string, string>>(new Map())
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set())
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_SUPPORT_URL}??"http://localhost:5000"`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on("connect", () => {
      setConnected(true)
      setError(null)
    })

    newSocket.on("disconnect", () => {
      setConnected(false)
    })

    newSocket.on("poll-created", (newPoll: Poll) => {
      setPolls((prev) => [newPoll, ...prev])
    })

    newSocket.on("vote-update", (data: { pollId: string; updatedPoll: Poll }) => {
      setPolls((prev) => prev.map((p) => (p.id === data.pollId ? data.updatedPoll : p)))
    })

    newSocket.on("like-update", (data: { pollId: string; updatedPoll: Poll }) => {
      setPolls((prev) => prev.map((p) => (p.id === data.pollId ? data.updatedPoll : p)))
    })

    setSocket(newSocket)

    // Fetch initial polls
    const fetchPolls = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPPORT_URL??'http://localhost:5000'}/api/polls`)
        if (!response.ok) throw new Error("Failed to fetch polls")
        const data = await response.json()
        setPolls(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch polls")
        setLoading(false)
      }
    }

    fetchPolls()

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const createPoll = useCallback(async (question: string, options: string[]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPPORT_URL??'http://localhost:5000'}/api/polls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options }),
      })
      if (!response.ok) throw new Error("Failed to create poll")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll")
    }
  }, [])

  const votePoll = useCallback(async (pollId: string, optionId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPPORT_URL??'http://localhost:5000'}/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      })
      if (!response.ok) throw new Error("Failed to vote")
      setUserVotes((prev) => new Map(prev).set(pollId, optionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote")
    }
  }, [])

  const likePoll = useCallback(async (pollId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPPORT_URL??'http://localhost:5000'}/api/polls/${pollId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (!response.ok) throw new Error("Failed to like poll")
      setUserLikes((prev) => new Set(prev).add(pollId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like poll")
    }
  }, [])

  return (
    <RealTimeContext.Provider
      value={{
        polls,
        loading,
        error,
        connected,
        userVotes,
        userLikes,
        createPoll,
        votePoll,
        likePoll,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (!context) {
    throw new Error("useRealTime must be used within RealTimeProvider")
  }
  return context
}
