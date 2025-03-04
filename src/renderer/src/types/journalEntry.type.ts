import { Dayjs } from 'dayjs';

type JournalEntry = {
  id: number;
  content: string;
  createdAt: Dayjs;
  date: Dayjs;
};

export type { JournalEntry };
