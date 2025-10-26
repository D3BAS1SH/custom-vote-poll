'use client';

import { useState } from 'react';
import type { Poll } from '@/types/poll.types';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onLike: (pollId: string) => void;
}

export default function PollCard({ poll, onVote, onLike }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
      setSelectedOption('');
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">{poll.question}</h2>
      
      <div className="space-y-2">
        {poll.options.map((option) => (
          <div key={option.id} className="flex flex-col">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-radio"
              />
              <span>{option.text}</span>
            </label>
            <div className="mt-1">
              <div className="bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {option.votes} votes ({totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleVote}
          disabled={!selectedOption}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Vote
        </button>
        
        <button
          onClick={() => onLike(poll.id)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{poll.likes}</span>
        </button>
      </div>
    </div>
  );
}