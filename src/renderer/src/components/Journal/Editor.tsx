import PropTypes from 'prop-types';

const Editor = ({ content, setContent }): JSX.Element => {
  return (
    <div className="editor">
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="toolbar"></div>
    </div>
  );
};

Editor.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired
};

export default Editor;
