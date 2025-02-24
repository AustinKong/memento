import PropTypes from 'prop-types';
import { renderMarkdown } from '@renderer/markdownParser/renderer';
import { tokenize } from '@renderer/markdownParser/lexer';

const Display = ({ markdown }): JSX.Element => {
  const tokens = tokenize(markdown);
  const rendered = renderMarkdown(tokens);

  return <div>{rendered}</div>;
};

Display.propTypes = {
  markdown: PropTypes.string.isRequired
};

export default Display;
