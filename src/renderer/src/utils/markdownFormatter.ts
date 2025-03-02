import { Selection } from '../types/selection.types';

// Helper function to convert a string to a regex escaped string
const toEscaped = (str: string): string => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const applyInlineFormatting = (content: string, format: string, selection: Selection): string => {
  if (!selection) return content;

  if (selection.start.absChar === selection.end.absChar) {
    const WORD_BOUNDARY_EXP: RegExp = /\b(\w+)\b/g;
    return content.replace(WORD_BOUNDARY_EXP, (match, word, offset) => {
      if (offset <= selection.start.absChar && selection.start.absChar <= offset + match.length) {
        return `${format}${word}${format}`;
      } else {
        return match;
      }
    });
  } else {
    const selectedText = content.slice(selection.start.absChar, selection.end.absChar);
    return (
      content.slice(0, selection.start.absChar) +
      selectedText
        .split('\n')
        .map((line) => {
          const trimmedLine = line.trim();
          const leadingWhitespace = line.match(/^\s*/)?.[0] || '';
          const trailingWhitespace = line.match(/\s*$/)?.[0] || '';
          return trimmedLine
            ? `${leadingWhitespace}${format}${trimmedLine}${format}${trailingWhitespace}`
            : line;
        })
        .join('\n') +
      content.slice(selection.end.absChar, content.length)
    );
  }
};

const removeInlineFormatting = (content: string, format: string, selection: Selection): string => {
  if (!selection) return content;

  const FORMAT_EXP: RegExp = new RegExp(
    `${toEscaped(format)}([^ *].*?[^ *]|[^ *])${toEscaped(format)}`,
    'g'
  );
  if (selection.start.absChar === selection.end.absChar) {
    return content.replace(FORMAT_EXP, (match, text, offset) => {
      if (offset <= selection.start.absChar && selection.start.absChar <= offset + match.length) {
        return text;
      } else {
        return match;
      }
    });
  } else {
    return content.replace(FORMAT_EXP, (match, text, offset) => {
      if (
        (offset <= selection.start.absChar && selection.start.absChar <= offset + match.length) ||
        (offset <= selection.end.absChar && selection.end.absChar <= offset + match.length) ||
        (selection.start.absChar <= offset && offset + match.length <= selection.end.absChar)
      ) {
        return text;
      } else {
        return match;
      }
    });
  }
};

const toggleInlineFormatting = (content: string, format: string, selection: Selection): string => {
  if (!selection) return content;

  if (removeInlineFormatting(content, format, selection) === content) {
    return applyInlineFormatting(content, format, selection);
  } else {
    return removeInlineFormatting(content, format, selection);
  }
};

const toggleBold = (content: string, selection: Selection): string =>
  toggleInlineFormatting(content, '**', selection);

const toggleItalic = (content: string, selection: Selection): string =>
  toggleInlineFormatting(content, '_', selection);

const toggleCode = (content: string, selection: Selection): string =>
  toggleInlineFormatting(content, '`', selection);

export { toggleBold, toggleItalic, toggleCode };
