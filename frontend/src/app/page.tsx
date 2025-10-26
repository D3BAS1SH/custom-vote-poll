'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Poll, CreatePollData } from '@/types/poll.types';
import PollCard from '@/components/PollCard';
import CreatePoll from '@/components/CreatePoll';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
let socket: Socket;

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    // Fetch initial polls
    fetchPolls();

    // Initialize Socket.IO connection
    socket = io(API_URL);

    socket.on('vote-update', (data) => {
      setPolls((currentPolls) =>
        currentPolls.map((poll) =>
          poll.id === data.pollId ? { ...poll, ...data } : poll
        )
      );
    });

    socket.on('like-update', (data) => {
      setPolls((currentPolls) =>
        currentPolls.map((poll) =>
          poll.id === data.pollId ? { ...poll, likes: data.likes } : poll
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/polls`);
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  };

  const handleCreatePoll = async (pollData: CreatePollData) => {
    try {
      const response = await fetch(`${API_URL}/api/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });
      const newPoll = await response.json();
      setPolls((current) => [newPoll, ...current]);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId }),
      });
      const updatedPoll = await response.json();
      socket.emit('vote', updatedPoll);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleLike = async (pollId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/polls/${pollId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const updatedPoll = await response.json();
      socket.emit('like', updatedPoll);
    } catch (error) {
      console.error('Error liking poll:', error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Voting Platform</h1>
      <CreatePoll onCreatePoll={handleCreatePoll} />
      <div className="space-y-4">
        {polls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onVote={handleVote}
            onLike={handleLike}
          />
        ))}
      </div>
    </main>
  );
}