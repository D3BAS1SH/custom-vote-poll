export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  likes: number;
  createdAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CreatePollData {
  question: string;
  options: string[];
}