export type User = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export type JournalEntry = {
  timestamp: number;
  entry: string;
};

export type Skill = {
  id: string;
  name: string;
  userId: string;
  imageInHead: string;
  progress: number;
  journal: JournalEntry[];
};
