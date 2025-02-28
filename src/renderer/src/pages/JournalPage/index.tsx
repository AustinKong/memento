import { useRef, useState } from 'react';
import { ChevronLeft, BookOpen, PencilLine } from 'lucide-react';

import Display from '@renderer/components/Display';
import Editor from '@renderer/components/Editor';
import styles from './styles.module.css';
import IconButton from '@renderer/components/ui/IconButton';
import EditorToolbar from '@renderer/components/EditorToolbar';
import useSelection from '@renderer/hooks/useSelection';

const JournalPage = (): JSX.Element => {
  // Why not a context? Because updating a context causes a re-render of all consumers. And the content state updates on every keystroke.
  const [mode, setMode] = useState<'source' | 'preview'>('source');
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selection = useSelection(textareaRef);

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
            ref={textareaRef}
          />
        ) : (
          <Display markdown={content} />
        )}
        <EditorToolbar content={content} setContent={setContent} selection={selection} />
      </section>
    </main>
  );
};

export default JournalPage;
