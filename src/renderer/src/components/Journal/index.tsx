import { useState } from 'react';
import Editor from './Editor';
import Display from './Display';

const Journal = (): JSX.Element => {
  const [mode, setMode] = useState<'source' | 'preview'>('source');
  const [content, setContent] = useState('');

  return (
    <main>
      {mode === 'source' ? (
        <Editor content={content} setContent={setContent} />
      ) : (
        <Display markdown={content} />
      )}
      <button onClick={() => setMode(mode === 'source' ? 'preview' : 'source')}>
        Change to {mode === 'source' ? 'preview' : 'source'} mode
      </button>
    </main>
  );
};

export default Journal;
