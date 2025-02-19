// https://www.reddit.com/r/reactjs/comments/1905utu/creating_a_rich_text_editor_in_react_no_packages/

import { useState } from 'react';

const Editor = (): JSX.Element => {
  const [lines, setLines] = useState<string[]>(['# My first markdown line', '', 'my second']);
  const [caretPos, setCaretPos] = useState<number>(0);

  const onChange = (text: string, index: number): void => {
    const newLines = [...lines];
    newLines[index] = text;
    setLines(newLines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number): void => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents default newline behavior
      const newLines = [...lines];
      newLines.splice(index + 1, 0, ''); // Insert a new empty line
      setLines(newLines);
      setTimeout(() => {
        const nextLine = document.getElementById(`line-${index + 1}`);
        nextLine?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && lines[index] === '' && lines.length > 1) {
      e.preventDefault();
      const newLines = [...lines];
      newLines.splice(index, 1); // Remove empty line
      setLines(newLines);
      setTimeout(() => {
        const prevLine = document.getElementById(`line-${index - 1}`);
        prevLine?.focus();
      }, 0);
    }
    /*
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextLine = document.getElementById(`line-${index + 1}`);
      nextLine?.focus();
    } else if (e.key === 'ArrowUp' && lines.length > 1) {
      e.preventDefault();
      const nextLine = document.getElementById(`line-${index - 1}`);
      nextLine?.focus();
    }
      */
  };

  return (
    <div>
      {
        /*
      {lines.map((line, index) => (
        <div
          id={`line-${index}`}
          key={index}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onChange(e.currentTarget.innerText, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {line}
        </div>
      ))}
        */}
      <h2>Altnerative</h2>
      <div
        contentEditable
        suppressContentEditableWarning
        spellCheck="false"
        style={{ marginLeft: 16, outline: 'none' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setLines([...lines.slice(0, 2), '', ...lines.slice(2)]);
          }
        }}
        onFocus={() => {
          // set caret location
        }}
        onBlur={(e) => console.log(e.target.innerText)}
      >
        {lines.map((line, index) => (line === '' ? <br key={index} /> : <p key={index}>{line}</p>))}
        <h1>tester</h1>
      </div>
    </div>
  );
};

export default Editor;
