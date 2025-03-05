import { useEffect, useState } from 'react';
import { ChevronLeft, BookOpen, PencilLine } from 'lucide-react';

import Display from '@renderer/components/Display';
import Editor from '@renderer/components/Editor';
import IconButton from '@renderer/components/ui/IconButton';
import ScrollableCalendar from '@renderer/components/ScrollableCalendar';
import styles from './styles.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { getJournalEntryByDate, saveJournalEntry } from '@renderer/services/journal';
import useEffectDebounced from '@renderer/hooks/useDebounce';

const JournalPage = (): JSX.Element => {
  // Why not a context? Because updating a context causes a re-render of all consumers. And the content state updates on every keystroke.
  const [mode, setMode] = useState<'source' | 'preview'>('source');
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [content, setContent] = useState('');

  useEffect(() => {
    getJournalEntryByDate(date).then((entry) => {
      setContent(entry?.content || '');
    });
  }, [date]);

  // Autosave
  useEffectDebounced(
    () => {
      saveJournalEntry(content, date);
    },
    [content],
    1000
  );

  const handleToggleMode = (): void => {
    saveJournalEntry(content, date);
    setMode(mode === 'source' ? 'preview' : 'source');
  };

  const handleChangeDate = (newDate: Dayjs): void => {
    saveJournalEntry(content, date);
    setDate(newDate);
  };

  return (
    <main className={styles.journalPage}>
      <nav className={styles.toolbar}>
        <IconButton icon={<ChevronLeft />} onClick={() => console.log('click')} ariaLabel="Home" />
        <div className={styles.date}>{new Date().toISOString()}</div>
        <IconButton
          icon={mode === 'source' ? <BookOpen /> : <PencilLine />}
          onClick={handleToggleMode}
          ariaLabel="Toggle mode"
        />
      </nav>
      <section className={styles.content}>
        {mode === 'source' ? (
          <Editor
            content={content}
            setContent={setContent}
            placeholder="Type something to get started"
          />
        ) : (
          <Display markdown={content} />
        )}
      </section>
      <aside className={styles.leftAside}>
        <ScrollableCalendar initialDate={dayjs()} onChangeDate={handleChangeDate} />
      </aside>
    </main>
  );
};

export default JournalPage;
