import { Poll, PollOption } from '../types/poll.types';

// In-memory store for polls (in a real app, this would be a database)
const polls: Map<string, Poll> = new Map();

export const pollService = {
  createPoll: (question: string, options: string[]): Poll => {
    const pollOptions: PollOption[] = options.map((text) => ({
      id: Math.random().toString(36).substring(7),
      text,
      votes: 0,
    }));

    const poll: Poll = {
      id: Math.random().toString(36).substring(7),
      question,
      options: pollOptions,
      likes: 0,
      createdAt: new Date(),
    };

    polls.set(poll.id, poll);
    return poll;
  },

  getAllPolls: (): Poll[] => {
    return Array.from(polls.values());
  },

  getPoll: (id: string): Poll | undefined => {
    return polls.get(id);
  },

  vote: (pollId: string, optionId: string): Poll | undefined => {
    const poll = polls.get(pollId);
    if (!poll) return undefined;

    const updatedPoll = {
      ...poll,
      options: poll.options.map((option) =>
        option.id === optionId ? { ...option, votes: option.votes + 1 } : option
      ),
    };

    polls.set(pollId, updatedPoll);
    return updatedPoll;
  },

  like: (pollId: string): Poll | undefined => {
    const poll = polls.get(pollId);
    if (!poll) return undefined;

    const updatedPoll = {
      ...poll,
      likes: poll.likes + 1,
    };

    polls.set(pollId, updatedPoll);
    return updatedPoll;
  },
};