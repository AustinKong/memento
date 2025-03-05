import { RefObject, useEffect } from 'react';
import { SelectionPosition, Selection } from '../types/selection.types';
import useDebouncedState from './useDebouncedState';

// Exposes the start and end positions of the current selection in a textarea
// as line and character offsets or null otherwise.
const useSelection = (
  textareaRef: RefObject<HTMLTextAreaElement>
): [Selection, (startAbsChar: number, endAbsChar: number) => void] => {
  const [selection, setSelection] = useDebouncedState<Selection>(null, 100);

  // Helper function to convert absolute character position to line and character offsets
  const calculateSelectionPosition = (
    content: string,
    absChar: number
  ): SelectionPosition | null => {
    const lines = content.split('\n');
    let selectionPosition: SelectionPosition | null = null;
    lines.reduce((charCount: number, line: string, index: number): number => {
      const lineLength = line.length + 1;
      if (selectionPosition === null && charCount + lineLength >= absChar) {
        selectionPosition = {
          line: index,
          char: absChar - charCount,
          absChar
        };
      }
      return charCount + lineLength;
    }, 0);
    return selectionPosition;
  };

  // Force selection object and textarea update based on provided values
  const updateSelectionForce = (startAbsChar: number, endAbsChar: number): void => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { value } = textarea;
    const selectionRange = {
      start: calculateSelectionPosition(value, startAbsChar),
      end: calculateSelectionPosition(value, endAbsChar)
    };

    if (selectionRange.start && selectionRange.end) {
      setSelection(selectionRange as { start: SelectionPosition; end: SelectionPosition });
      textarea.focus();
      textarea.setSelectionRange(selectionRange.start.absChar, selectionRange.end.absChar);
    } else {
      setSelection(null);
    }
  };

  useEffect(() => {
    // Update selection object when textarea changes
    const updateSelection = (): void => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setSelection(null);
        return;
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
      const { selectionStart, selectionEnd, value } = textarea;
      const selectionRange = {
        start: calculateSelectionPosition(value, selectionStart),
        end: calculateSelectionPosition(value, selectionEnd)
      };

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

  return [selection, updateSelectionForce];
};

export default useSelection;
