import { useState } from 'react';
import { ChevronLeft, BookOpen, PencilLine } from 'lucide-react';

import Display from '@renderer/components/Display';
import Editor from '@renderer/components/Editor';
import styles from './styles.module.css';
import IconButton from '@renderer/components/ui/IconButton';

const JournalPage = (): JSX.Element => {
  const [mode, setMode] = useState<'source' | 'preview'>('source');
  const [content, setContent] = useState('');

  return (
    <main className={styles.journalPage}>
      <nav className={styles.toolbar}>
        <IconButton icon={<ChevronLeft />} onClick={() => console.log('click')} ariaLabel="Home" />
        <div className={styles.date}>{new Date().toISOString()}</div>
        <IconButton
          icon={mode === 'source' ? <BookOpen /> : <PencilLine />}
          onClick={() => setMode(mode === 'source' ? 'preview' : 'source')}
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
    </main>
  );
};

export default JournalPage;
