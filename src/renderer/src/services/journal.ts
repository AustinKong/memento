import { Dayjs } from 'dayjs';
import { JournalEntry } from '@renderer/types/journalEntry.type';

const { ipcRenderer } = window.electron;

export const getJournalEntryByDate = async (date: Dayjs): Promise<JournalEntry | null> => {
  return await ipcRenderer.invoke('journal:getByDate', date.format('YYYY-MM-DD'));
};

export const saveJournalEntry = (content: string, date: Dayjs): void => {
  ipcRenderer.invoke('journal:save', content, date.format('YYYY-MM-DD'));
};
