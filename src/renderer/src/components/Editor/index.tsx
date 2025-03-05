import useSelection from '@renderer/hooks/useSelection';
import EditorToolbar from './EditorToolbar';
import styles from './styles.module.css';
import { useRef } from 'react';

interface EditorProps {
  content: string;
  setContent: (value: string) => void;
  placeholder?: string;
}

const Editor = ({ content, setContent, placeholder }: EditorProps): JSX.Element => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, updateSelection] = useSelection(textareaRef);

  return (
    <>
      <div className={styles.editor}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          ref={textareaRef}
        />
      </div>
      <EditorToolbar
        content={content}
        setContent={setContent}
        selection={selection}
        updateSelection={updateSelection}
      />
    </>
  );
};

export default Editor;
