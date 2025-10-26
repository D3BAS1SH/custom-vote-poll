"use client"

import type React from "react"

import { useState } from "react"
import { useRealTime } from "@/context/realtime-context"
import { X } from "lucide-react"

interface PollCreatorProps {
  onSuccess: () => void
}

export default function PollCreator({ onSuccess }: PollCreatorProps) {
  const { createPoll } = useRealTime()
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (question.trim().length < 5 || question.trim().length > 200) {
      setError("Question must be between 5 and 200 characters")
      return
    }

    const filledOptions = options.filter((opt) => opt.trim().length > 0)
    if (filledOptions.length < 2) {
      setError("Please provide at least 2 options")
      return
    }

    if (filledOptions.length > 10) {
      setError("Maximum 10 options allowed")
      return
    }

    setIsSubmitting(true)
    try {
      await createPoll(question, filledOptions)
      setQuestion("")
      setOptions(["", ""])
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Create a New Poll</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-in fade-in duration-300">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Poll Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to ask?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">{question.length}/200 characters</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 10 && (
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-3 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
          >
            + Add Option
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 transform hover:scale-105"
        >
          {isSubmitting ? "Creating..." : "Create Poll"}
        </button>
      </div>
    </form>
  )
}
