type Token = TextToken | InlineToken | BlockToken;

// Most basic building block, holds plain text
type TextToken = {
  type: 'text';
  text: string;
};

// Inline tokens can be nested under other token types, and can nest other tokens
type InlineToken = {
  type: 'boldItalic' | 'bold' | 'italic' | 'code';
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

export type { Token, TextToken, InlineToken, BlockToken, Header, Blockquote, Paragraph };
