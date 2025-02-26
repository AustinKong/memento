import PropTypes from 'prop-types';
import styles from './styles.module.css';

const Editor = ({ content, setContent, placeholder }): JSX.Element => {
  return (
    <div className={styles.editor}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

Editor.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default Editor;
