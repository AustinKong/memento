import { Selection } from '../types/selection.types';

// Expected behaviour for inline md
// Selection only the caret position: bold the word at the caret position
// Selection within one line: bold the selected text (leaving no whitespace between the markup symbols and the text) - i.e. " this is the selection " --bold--> " **this is the selection** "
// Selection across multiple lines: bold the selected text in the line, also leave no whitespace between markup symbol and text
// Also, if there exists a block markdown at the targeted line, put the markup symbol AFTER the block markdown - i.e. "# this is a h2" -- bold --> "# **this is a h2**"

// Expected behaviour for block md
// Selection only the caret or one line Apply the format to the entire line
// Selection across multiple lines: Apply the format to all lines in the selection
const applyInlineFormatting = (content: string, selection: Selection, format: string): string => {
  if (!selection) return content;

  let lines = content.split('\n');
  const BLOCK_EXP: RegExp = /^((#{1,6}|>) )/;

  // Helper function
  const wrapText = (line: string, start: number, end: number): string => {
    const blockMatch = line.match(BLOCK_EXP);
    const blockPrefix = blockMatch ? blockMatch[0] : '';
    const text = line.slice(blockPrefix.length, line.length);

    const adjustedStart = Math.max(start - blockPrefix.length, 0);
    const adjustedEnd = Math.max(end - blockPrefix.length, 0);

    return (
      blockPrefix +
      text.slice(0, adjustedStart) +
      format +
      text.slice(adjustedStart, adjustedEnd) +
      format +
      text.slice(adjustedEnd)
    );
  };

  const wrapWordAtCaret = (line: string, caretPos: number): string => {
    const blockMatch = line.match(BLOCK_EXP);
    const blockPrefix = blockMatch ? blockMatch[0] : '';
    const text = line.slice(blockPrefix.length, line.length);
    return (
      blockPrefix +
      text.replace(/\b(\w+)\b/g, (match, word, offset) =>
        offset <= caretPos && caretPos <= offset + word.length ? `${format}${word}${format}` : match
      )
    );
  };

  if (selection.start.line === selection.end.line && selection.start.char === selection.end.char) {
    // Case 1: No range in selection (apply formatting to word at caret)
    lines[selection.start.line] = wrapWordAtCaret(
      lines[selection.start.line],
      selection.start.char
    );
  } else if (selection.start.line === selection.end.line) {
    // Case 2: Selection range spans 1 line
    lines[selection.start.line] = wrapText(
      lines[selection.start.line],
      selection.start.char,
      selection.end.char
    );
  } else {
    // Case 3: Selection range spans multiple lines
    lines = lines.map((line, index) => {
      if (index === selection.start.line) {
        return wrapText(lines[index], selection.start.char, line.length);
      } else if (index === selection.end.line) {
        return wrapText(lines[index], 0, selection.end.char);
      } else if (selection.start.line < index && index < selection.end.line) {
        return wrapText(lines[index], 0, line.length);
      } else {
        return line;
      }
    });
  }

  return lines.join('\n');
};

// Expected behaviour for inline md
// Selection only the caret position: remove formatting from the word at the caret position
// Selection within one line and multiple lines: remove formatting from all formatted ranges which the selection falls within
const removeInlineFormatting = (content: string, selection: Selection, format: string): string => {
  if (!selection) return content;

  let lines = content.split('\n');
  const FORMAT_EXP: RegExp = new RegExp(`${format}([^ *].*?[^ *]|[^ *])${format}`, 'g');

  const removeFormat = (line: string, start: number, end: number): string => {
    return line.replace(FORMAT_EXP, (match, text, offset) => {
      if (offset + match.length >= start && offset <= end) return text;
      else return match;
    });
  };

  if (selection.start.line === selection.end.line) {
    // Case 1: Selection range or caret spans 1 line
    lines[selection.start.line] = removeFormat(
      lines[selection.start.line],
      selection.start.char,
      selection.end.char
    );
  } else {
    // Case 2: Selection range spans multiple lines
    lines = lines.map((line, index) => {
      if (index === selection.start.line) {
        return removeFormat(line, selection.start.char, line.length);
      } else if (index === selection.end.line) {
        return removeFormat(line, 0, selection.end.char);
      } else if (selection.start.line < index && index < selection.end.line) {
        return removeFormat(line, 0, line.length);
      } else {
        return line;
      }
    });
  }

  return lines.join('\n');
};

// Returns true if no formatting detected in selection, then should apply. Else returns false, then should remove formatting
const shouldApplyInlineFormatting = (
  content: string,
  selection: Selection,
  format: string
): boolean | undefined => {
  if (!selection) return undefined;
  const TEST_EXP: RegExp = new RegExp(`${format}`, 'g');
  return !content.split('\n').some((line, index) => {
    if (selection.start.line > index || index > selection.end.line) {
      return false;
    } else if (index === selection.start.line && index === selection.end.line) {
      return line.slice(selection.start.char, selection.end.char).match(TEST_EXP);
    } else if (index === selection.start.line) {
      return line.slice(selection.start.char, line.length).match(TEST_EXP);
    } else if (index === selection.end.line) {
      return line.slice(0, selection.end.char).match(TEST_EXP);
    } else {
      return line.match(TEST_EXP);
    }
  });
};

/*
const applyBlockFormatting = (
  content: string,
  selection: Selection,
  format: string
): string => {
  if (!selection) return content;
  return format;
};
*/

const toggleBold = (content: string, selection: Selection): string => {
  if (shouldApplyInlineFormatting(content, selection, '\\*\\*')) {
    return applyInlineFormatting(content, selection, '**');
  } else {
    return removeInlineFormatting(content, selection, '\\*\\*');
  }
};

export { toggleBold };
