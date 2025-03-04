import { RefObject, useEffect } from 'react';
import { SelectionPosition, Selection } from '../types/selection.types';
import useDebouncedState from './useDebouncedState';

// Exposes the start and end positions of the current selection in a textarea
// as line and character offsets or null otherwise.
const useSelection = (textareaRef: RefObject<HTMLTextAreaElement>): Selection => {
  const [selection, setSelection] = useDebouncedState<Selection>(null, 100);

  useEffect(() => {
    const updateSelection = (): void => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setSelection(null);
        return;
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
      const { selectionStart, selectionEnd, value } = textarea;
      const selectionRange: { start: SelectionPosition | null; end: SelectionPosition | null } = {
        start: null,
        end: null
      };
      const lines = value.split('\n');

      lines.reduce((charCount: number, line: string, index: number): number => {
        const lineLength = line.length + 1;
        if (selectionRange.start === null && charCount + lineLength >= selectionStart) {
          selectionRange.start = {
            line: index,
            char: selectionStart - charCount,
            absChar: selectionStart
          };
        }
        if (selectionRange.end === null && charCount + lineLength >= selectionEnd) {
          selectionRange.end = {
            line: index,
            char: selectionEnd - charCount,
            absChar: selectionEnd
          };
        }
        return charCount + lineLength;
      }, 0);

      if (selectionRange.start && selectionRange.end) {
        setSelection(selectionRange as { start: SelectionPosition; end: SelectionPosition });
      } else {
        setSelection(null);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('selectionchange', updateSelection);
    }

    return (): void => {
      if (textarea) {
        textarea.removeEventListener('selectionchange', updateSelection);
      }
    };
  }, [setSelection, textareaRef]);

  return selection;
};

export default useSelection;
