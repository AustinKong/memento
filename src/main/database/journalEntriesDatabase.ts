import Database from 'better-sqlite3';
import { JournalEntry, JournalEntryDb } from '../models/journalEntry.model';
import dayjs, { Dayjs } from 'dayjs';

export class JournalEntriesDatabase {
  private db: Database.Database;

  constructor() {
    this.db = new Database('database.db');
    this.setup();
  }

  private setup(): void {
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS journal_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT,
          created_at TEXT NOT NULL,
          date TEXT NOT NULL UNIQUE
          )
        `
      )
      .run();
  }

  save(content: string, date: Dayjs): void {
    const row: JournalEntryDb = {
      id: 0,
      content,
      created_at: dayjs().toISOString(),
      date: date.format('YYYY-MM-DD')
    };
    this.db
      .prepare(
        `INSERT INTO journal_entries (content, created_at, date) 
         VALUES (?, ?, ?)
         ON CONFLICT(date) 
         DO UPDATE SET content = excluded.content, created_at = created_at`
      )
      .run(row.content, row.created_at, row.date);
  }

  getAll(): JournalEntry[] {
    const rows: JournalEntryDb[] = this.db
      .prepare(`SELECT * FROM journal_entries`)
      .all() as JournalEntryDb[];

    return rows.map((row) => {
      return {
        id: row.id,
        content: row.content,
        createdAt: dayjs(row.created_at),
        date: dayjs(row.date)
      } as JournalEntry;
    });
  }

  getById(id: number): JournalEntry | null {
    const row: JournalEntryDb = this.db
      .prepare(`SELECT * FROM journal_entries WHERE id = ?`)
      .get(id) as JournalEntryDb;

    if (!row) return null;

    return {
      id: row.id,
      content: row.content,
      createdAt: dayjs(row.created_at),
      date: dayjs(row.date)
    } as JournalEntry;
  }

  getByDate(date: Dayjs): JournalEntry | null {
    const row: JournalEntryDb = this.db
      .prepare(`SELECT * FROM journal_entries WHERE date = ?`)
      .get(date.format('YYYY-MM-DD')) as JournalEntryDb;

    if (!row) return null;

    return {
      id: row.id,
      content: row.content,
      createdAt: dayjs(row.created_at),
      date: dayjs(row.date)
    } as JournalEntry;
  }
}
