import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { tokenize } from '../src/renderer/src/utils/markdownParser/parser';
import { renderMarkdown } from '../src/renderer/src/utils/markdownParser/renderer';
import { Header, Token } from '../src/renderer/src/utils/markdownParser/types';

describe('Markdown tokenizer base cases', () => {
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

describe('Markdown tokenizer edge cases', () => {
  test('Tokenizes multiple inline elements', () => {
    const input = '**Lorem** ipsum **dolor** sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'bold',
            children: [{ type: 'text', text: 'Lorem' }]
          },
          { type: 'text', text: ' ipsum ' },
          {
            type: 'bold',
            children: [{ type: 'text', text: 'dolor' }]
          },
          { type: 'text', text: ' sit amet.' }
        ]
      }
    ]);
  });

  test('Does not tokenize inline elements with spaces around them', () => {
    const input = '** Lorem ** ipsum ** dolor ** sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '** Lorem ** ipsum ** dolor ** sit amet.' }]
      }
    ]);
  });

  test('Tokenizess single character inline elements', () => {
    const input = '**L**ore*m* ipsum dolor sit amet.';
    expect(tokenize(input)).toEqual([
      {
        type: 'paragraph',
        children: [
          {
            type: 'bold',
            children: [{ type: 'text', text: 'L' }]
          },
          { type: 'text', text: 'ore' },
          {
            type: 'italic',
            children: [{ type: 'text', text: 'm' }]
          },
          { type: 'text', text: ' ipsum dolor sit amet.' }
        ]
      }
    ]);
  });
});

describe('Markdown renderer', () => {
  test('Renders plain text', () => {
    const tokens: Token[] = [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }]
      }
    ];

    const { container } = render(renderMarkdown(tokens));
    const paragraph = container.querySelector('.paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Lorem ipsum dolor sit amet.');
  });

  test('Renders bold text', () => {
    const tokens: Token[] = [
      {
        type: 'paragraph',
        children: [
          { type: 'bold', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ];

    const { container } = render(renderMarkdown(tokens));
    const paragraph = container.querySelector('.paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Lorem ipsum dolor sit amet.');
    const bold = container.querySelector('.bold');
    expect(bold).toBeInTheDocument();
    expect(bold).toHaveTextContent('Lorem ipsum');
  });

  test('Renders italic text', () => {
    const tokens: Token[] = [
      {
        type: 'paragraph',
        children: [
          { type: 'italic', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ];

    const { container } = render(renderMarkdown(tokens));
    const paragraph = container.querySelector('.paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Lorem ipsum dolor sit amet.');
    const italic = container.querySelector('.italic');
    expect(italic).toBeInTheDocument();
    expect(italic).toHaveTextContent('Lorem ipsum');
  });

  test('Renders bold italic text', () => {
    const tokens: Token[] = [
      {
        type: 'paragraph',
        children: [
          { type: 'boldItalic', children: [{ type: 'text', text: 'Lorem ipsum' }] },
          { type: 'text', text: ' dolor sit amet.' }
        ]
      }
    ];

    const { container } = render(renderMarkdown(tokens));
    const paragraph = container.querySelector('.paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Lorem ipsum dolor sit amet.');
    const bold = container.querySelector('.bold');
    expect(bold).toBeInTheDocument();
    expect(bold).toHaveTextContent('Lorem ipsum');
    const italic = container.querySelector('.italic');
    expect(italic).toBeInTheDocument();
    expect(italic).toHaveTextContent('Lorem ipsum');
  });

  test.each([1, 2, 3, 4, 5, 6])('Renders h%i', (level: number) => {
    const tokens: Token[] = [
      {
        type: 'header',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }],
        level
      } as Header
    ];

    const { container } = render(renderMarkdown(tokens));
    const header = container.querySelector(`.h${level}`);
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Lorem ipsum dolor sit amet.');
  });

  test('Renders blockquote', () => {
    const tokens: Token[] = [
      {
        type: 'blockquote',
        children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet.' }]
      }
    ];

    const { container } = render(renderMarkdown(tokens));
    const blockquote = container.querySelector('.blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent('Lorem ipsum dolor sit amet.');
  });

  test('Renders nested inline elements', () => {
    const tokens: Token[] = [
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
    ];

    const { container } = render(renderMarkdown(tokens));
    const bold = container.querySelector('.bold');
    expect(bold).toBeInTheDocument();
    expect(bold).toHaveTextContent('Lorem ipsum dolor');
    const italic = container.querySelector('.italic');
    expect(italic).toBeInTheDocument();
    expect(italic).toHaveTextContent('ipsum');
  });

  test('Renders nested block and inline elements', () => {
    const tokens: Token[] = [
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
    ];

    const { container } = render(renderMarkdown(tokens));
    const blockquote = container.querySelector('.blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent('Lorem ipsum dolor sit amet.');
    const bold = container.querySelector('.bold');
    expect(bold).toBeInTheDocument();
    expect(bold).toHaveTextContent('Lorem ipsum dolor');
    const italic = container.querySelector('.italic');
    expect(italic).toBeInTheDocument();
    expect(italic).toHaveTextContent('ipsum');
  });
});
