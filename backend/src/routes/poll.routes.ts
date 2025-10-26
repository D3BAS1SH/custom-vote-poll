import express, { Request, Response } from 'express';
import { pollService } from '../services/poll.service';

const router = express.Router();

// Create a new poll
router.post('/', (req: Request, res: Response) => {
  const { question, options } = req.body;
  if (!question || !options || !Array.isArray(options)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const poll = pollService.createPoll(question, options);

  // Emit an event to all clients about the new poll
  (req as any).io.emit('poll-created', poll);

  res.status(201).json(poll);
});

// Get all polls
router.get('/', (req, res) => {
  const polls = pollService.getAllPolls();
  res.json(polls);
});

// Get a specific poll
router.get('/:id', (req, res) => {
  const poll = pollService.getPoll(req.params.id);
  if (!poll) {
    return res.status(404).json({ error: 'Poll not found' });
  }
  res.json(poll);
});

// Vote on a poll
router.post('/:id/vote', (req, res) => {
  const { optionId } = req.body;
  if (!optionId) {
    return res.status(400).json({ error: 'Option ID is required' });
  }

  const updatedPoll = pollService.vote(req.params.id, optionId);
  if (!updatedPoll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  // Emit vote update event to all connected clients
  (req as any).io.emit('vote-update', {
    pollId: req.params.id,
    updatedPoll: updatedPoll
  });

  res.json(updatedPoll);
});

// Like a poll
router.post('/:id/like', (req, res) => {
  const updatedPoll = pollService.like(req.params.id);
  if (!updatedPoll) {
    return res.status(404).json({ error: 'Poll not found' });
  }

  // Emit like update event to all connected clients
  (req as any).io.emit('like-update', {
    pollId: req.params.id,
    updatedPoll: updatedPoll
  });

  res.json(updatedPoll);
});

export default router;