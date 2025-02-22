import { useState } from 'react';

const Editor = (): JSX.Element => {
  const [content, setContent] = useState('');

  return (
    <div className="editor">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="toolbar"></div>
    </div>
  );
};

export default Editor;
