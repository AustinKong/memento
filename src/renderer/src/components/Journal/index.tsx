import { useState } from 'react';
import Editor from './Editor';
import Display from './Display';

const Journal = (): JSX.Element => {
  const [mode, setMode] = useState<'source' | 'preview'>('source');

  return (
    <main>
      {mode === 'source' ? <Editor /> : <Display markdown={'# Some test md'} />}
      <button onClick={() => setMode(mode === 'source' ? 'preview' : 'source')}>
        Change to {mode === 'source' ? 'preview' : 'source'} mode
      </button>
    </main>
  );
};

export default Journal;
