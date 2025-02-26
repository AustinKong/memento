import PropTypes from 'prop-types';
import { renderMarkdown } from '@renderer/utils/markdownParser/renderer';
import { tokenize } from '@renderer/utils/markdownParser/parser';

const Display = ({ markdown }): JSX.Element => {
  const tokens = tokenize(markdown);
  const rendered = renderMarkdown(tokens);

  return <div>{rendered}</div>;
};

Display.propTypes = {
  markdown: PropTypes.string.isRequired
};

export default Display;
