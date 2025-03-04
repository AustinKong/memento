import { Dayjs } from 'dayjs';

export type JournalEntry = {
  id: number;
  content: string;
  createdAt: Dayjs;
  date: Dayjs;
};

export type JournalEntryDb = {
  id: number;
  content: string;
  created_at: string; // ISO timestamp
  date: string; // YYYY-MM-DD
};
