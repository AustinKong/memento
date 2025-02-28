import {
  Token,
  TextToken,
  InlineToken,
  Header,
  Blockquote,
  Paragraph
} from '../../types/markdownParser.types';

/*
 * https://www.markdownguide.org/basic-syntax/
 * According to markdown syntax guide, we don't have to support using underscores `_` for bold and underline, its generally not recommended
 */
const tokenize = (markdown: string): Token[] => {
  const lines = markdown.split('\n');
  const tokens: Token[] = [];

  for (const line of lines) {
    if (line === '') continue;

    // All cases of BlockTokens
    if (line.match(/^#{1,6} /)) {
      tokens.push({
        type: 'header',
        children: inlineTokenize(line.replace(/^#{1,6} /, '')),
        level: Math.min(line.match(/^#{1,6}/)?.[0].length || 1, 6)
      } as Header);
    } else if (line.match(/^> /)) {
      tokens.push({
        type: 'blockquote',
        children: inlineTokenize(line.replace(/^> /, ''))
      } as Blockquote);
    } else {
      tokens.push({
        type: 'paragraph',
        children: inlineTokenize(line)
      } as Paragraph);
    }
  }

  return tokens;
};

const inlineTokenize = (line: string): (TextToken | InlineToken)[] => {
  const regex: RegExp =
    /\*\*\*([^ *].*?[^ *]|[^ *])\*\*\*|\*\*([^ ].*?[^ ]|[^ *])\*\*|\*([^ *].*?[^ *]|[^ *])\*|`([^ ].*?[^ ]|[^ *])`/g;
  const tokens: (TextToken | InlineToken)[] = [];

  let lastIndex = 0;

  // All cases of InlineTokens
  line.replace(regex, (match, boldItalic, bold, italic, code, offset) => {
    if (lastIndex < offset) {
      tokens.push({ type: 'text', text: line.slice(lastIndex, offset) });
    }

    if (boldItalic) {
      tokens.push({ type: 'boldItalic', children: inlineTokenize(boldItalic) } as InlineToken);
    } else if (bold) {
      tokens.push({ type: 'bold', children: inlineTokenize(bold) } as InlineToken);
    } else if (italic) {
      tokens.push({ type: 'italic', children: inlineTokenize(italic) } as InlineToken);
    } else if (code) {
      tokens.push({ type: 'code', children: inlineTokenize(code) } as InlineToken);
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < line.length) {
    tokens.push({ type: 'text', text: line.slice(lastIndex) } as TextToken);
  }

  return tokens;
};

export { tokenize };
