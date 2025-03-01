import { toggleBold } from '../src/renderer/src/utils/markdownFormatter';

// TODO: Unimportant, but check if the line and char properties are correct
describe('Markdown formatter for inline markup', () => {
  test('Apply inline formatting at caret position within word', () => {
    const input = 'Lorem ipsum dolor sit amet.';
    const selection = {
      start: { line: 0, char: 6, absChar: 6 },
      end: { line: 0, char: 6, absChar: 6 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem **ipsum** dolor sit amet.');
  });

  test('Apply inline formatting to selected text within one line', () => {
    const input = 'Lorem ipsum dolor sit amet.';
    const selection = {
      start: { line: 0, char: 6, absChar: 6 },
      end: { line: 0, char: 11, absChar: 11 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem **ipsum** dolor sit amet.');
  });

  test('Apply inline formatting to selected text across multiple lines', () => {
    const input = 'Lorem ipsum\ndolor sit amet.';
    const selection = {
      start: { line: 0, char: 6, absChar: 6 },
      end: { line: 1, char: 5, absChar: 17 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem **ipsum**\n**dolor** sit amet.');
  });

  test('Apply inline formatting to selected text with trailing whitespace', () => {
    const input = 'Lorem ipsum \ndolor sit amet.';
    const selection = {
      start: { line: 0, char: 0, absChar: 0 },
      end: { line: 0, char: 12, absChar: 12 }
    };

    expect(toggleBold(input, selection)).toBe('**Lorem ipsum** \ndolor sit amet.');
  });

  // TODO: This edge case will not be covered for now, since it might require a
  // Refactor of the markdownFormatter logic. I.e. instead of applying markup using Regex
  // We might need to transform contents into tokens, and apply formatting, then transform back
  test.skip('Apply inline formatting to selected text with block markdown', () => {
    const input = '# Lorem ipsum dolor sit amet.';
    const selection = {
      start: { line: 0, char: 0, absChar: 0 },
      end: { line: 0, char: 19, absChar: 19 }
    };

    expect(toggleBold(input, selection)).toBe('# **Lorem ipsum dolor** sit amet.');
  });

  test('Remove inline formatting at caret position within formatted word', () => {
    const input = 'Lorem **ipsum** dolor sit amet.';
    const selection = {
      start: { line: 0, char: 9, absChar: 9 },
      end: { line: 0, char: 9, absChar: 9 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem ipsum dolor sit amet.');
  });

  test('Remove inline formatting from selected text within one line', () => {
    const input = 'Lorem **ipsum** dolor sit amet.';
    const selection = {
      start: { line: 0, char: 6, absChar: 6 },
      end: { line: 0, char: 13, absChar: 13 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem ipsum dolor sit amet.');
  });

  test('Remove inline formatting from selected text across multiple lines', () => {
    const input = 'Lorem **ipsum**\n**dolor** sit amet.';
    const selection = {
      start: { line: 0, char: 6, absChar: 6 },
      end: { line: 1, char: 8, absChar: 20 }
    };

    expect(toggleBold(input, selection)).toBe('Lorem ipsum\ndolor sit amet.');
  });

  // TODO: Same as above
  test.skip('Remove inline formatting from selected text with block markdown', () => {
    const input = '# **Lorem ipsum dolor** sit amet.';
    const selection = {
      start: { line: 0, char: 2, absChar: 2 },
      end: { line: 0, char: 23, absChar: 23 }
    };

    expect(toggleBold(input, selection)).toBe('# Lorem ipsum dolor sit amet.');
  });
});
