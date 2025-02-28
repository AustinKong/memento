import { Bold, Italic, Underline, Strikethrough, List, ListOrdered } from 'lucide-react';

import Dropdown from '../ui/Dropdown';
import IconButton from '../ui/IconButton';
import { Selection } from '../../types/selection.types'

import styles from './styles.module.css';

const DROPDOWN_OPTIONS = [
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
  { value: 'p', label: 'Paragraph' },
  { value: 'blockquote', label: 'Blockquote' },
  { value: 'code', label: 'Code' }
];

interface EditorToolbarProps {
  content: string,
  setContent: (content: string) => void;
  selection: Selection;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const EditorToolbar = ({ content, setContent, selection, textareaRef }: EditorToolbarProps): JSX.Element => {
  const refocusCaret = () => {
    if (!textareaRef.current) return;
    textareaRef.current.focus();
    // TODO
  };

  return (
    <div className={styles.editorToolbar}>
      <Dropdown options={DROPDOWN_OPTIONS} onChange={() => {}} />
      <div className={styles.divider} />
      <IconButton icon={<Bold />} onClick={() => {}} ariaLabel="Bold" />
      <IconButton icon={<Italic />} onClick={() => {}} ariaLabel="Italic" />
      <IconButton icon={<Underline />} onClick={() => {}} ariaLabel="Underline" />
      <IconButton icon={<Strikethrough />} onClick={() => {}} ariaLabel="Strikethrough" />
      <div className={styles.divider} />
      <IconButton icon={<List />} onClick={() => {}} ariaLabel="Unordered list" />
      <IconButton icon={<ListOrdered />} onClick={() => {}} ariaLabel="Ordered list" />
    </div>
  );
};

export default EditorToolbar;
