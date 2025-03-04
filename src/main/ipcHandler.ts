import { ipcMain } from 'electron';
import { JournalEntriesDatabase } from './database/journalEntriesDatabase';
import dayjs from 'dayjs';
import { JournalEntry } from './models/journalEntry.model';

export function setupIpcHandlers(
  ipc: typeof ipcMain,
  journalEntriesDatabase: JournalEntriesDatabase
): void {
  ipc.handle('test:ping', () => {
    return 'pong';
  });

  ipc.handle('journal:save', (_event, content: string, date: string) => {
    journalEntriesDatabase.save(content, dayjs(date));
  });

  ipc.handle('journal:getByDate', (_event, date: string): JournalEntry | null => {
    return journalEntriesDatabase.getByDate(dayjs(date));
  });
}
