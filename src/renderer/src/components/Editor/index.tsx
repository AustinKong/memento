import { forwardRef } from 'react';
import styles from './styles.module.css';

interface EditorProps {
  content: string;
  setContent: (value: string) => void;
  placeholder?: string;
}

const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ content, setContent, placeholder }, ref): JSX.Element => {
    return (
      <div className={styles.editor}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          ref={ref}
        />
      </div>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
