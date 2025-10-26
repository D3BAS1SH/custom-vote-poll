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

export interface Vote {
  pollId: string;
  optionId: string;
}

export interface Like {
  pollId: string;
}