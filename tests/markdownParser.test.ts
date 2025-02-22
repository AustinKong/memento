import { tokenize } from '../src/renderer/src/markdownParser/lexer';

describe('Markdown tokenizer', () => {
  test('Tokenizes plain text', () => {
    const input = 'Lorem ipsum dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }]
      }
    ]);
  });

  test('Tokenizes bold text', () => {
    const input = '**Lorem ipsum** dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          { type: 'bold', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ]);
  });

  test('Tokenizes italic text', () => {
    const input = '*Lorem ipsum* dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          { type: 'italic', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ]);
  });

  test('Tokenizes bold italic text', () => {
    const input = '***Lorem ipsum*** dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          { type: 'boldItalic', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ]);
  });

  test.each([1, 2, 3, 4, 5, 6])('Tokenizes h%i', (level: number) => {
    const input = `${'#'.repeat(level)} Lorem ipsum dolor sit amet.`;
    expect(tokenize(input)).toEqual([
      {
        type: 'header',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }],
        level
      }
    ]);
  });

  test('Tokenizes blockquote', () => {
    const input = '> Lorem ipsum dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'blockquote',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }]
      }
    ]);
  });

  test('Tokenizes nested inline elements', () => {
    const input = '**Lorem *ipsum* dolor** sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'bold',
            children: [
              { type: 'text', text: 'Lorem ' },
              {
                type: 'italic',
                children: [{ type: 'text', text: 'ipsum' }]
              },
              { type: 'text', text: ' dolor' }
            ]
          },
          { type: 'text', text: ' sit amet.' }
        ]
      }
    ]);
  });

  test('Tokenizes nested block and inline elements', () => {
    const input = '> **Lorem *ipsum* dolor** sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'blockquote',
        children: [
          {
            type: 'bold',
            children: [
              { type: 'text', text: 'Lorem ' },
              {
                type: 'italic',
                children: [{ type: 'text', text: 'ipsum' }]
              },
              { type: 'text', text: ' dolor' }
            ]
          },
          { type: 'text', text: ' sit amet.' }
        ]
      }
    ]);
  });
});
