type Token = TextToken | InlineToken | BlockToken;

// Most basic building block, holds plain text
type TextToken = {
  type: 'text';
  text: string;
};

// Inline tokens can be nested under other token types, and can nest other tokens
type InlineToken = {
  type: 'bold' | 'italic' | 'code';
  children: (TextToken | InlineToken)[];
};

// Block tokens cannot be nested under other token types
type BlockToken = Header | Blockquote | Paragraph;

type Header = {
  type: 'header';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: (TextToken | InlineToken)[];
};

type Blockquote = {
  type: 'blockquote';
  children: (TextToken | InlineToken)[];
};

type Paragraph = {
  type: 'paragraph';
  children: (TextToken | InlineToken)[];
};

const tokenize = (markdown: string): Token[] => {
  const lines = markdown.split('\n');
  const tokens: Token[] = [];

  for (const line of lines) {
    // All cases of BlockTokens
    if (line.match(/^#{1, 6}/)) {
      tokens.push({
        type: 'header',
        children: inlineTokenize(line.replace(/^#{1, 6} /, '')),
        level: Math.min(line.match(/^#{1, 6}/)?.[0].length || 1, 6)
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
  const regex: RegExp = /\*\*(.*?)\*\*|_(.*?)_|`(.*?)`/g;
  const tokens: (TextToken | InlineToken)[] = [];

  let lastIndex = 0;

  // All cases of InlineTokens
  line.replace(regex, (match, bold, italic, code, offset) => {
    if (lastIndex < offset) {
      tokens.push({ type: 'text', text: line.slice(lastIndex, offset) });
    }

    if (bold) {
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

export default tokenize;
