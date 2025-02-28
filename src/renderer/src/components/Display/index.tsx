import { renderMarkdown } from '@renderer/utils/markdownParser/renderer';
import { tokenize } from '@renderer/utils/markdownParser/parser';

interface DisplayProps {
  markdown: string;
}

const Display = ({ markdown }: DisplayProps): JSX.Element => {
  const tokens = tokenize(markdown);
  const rendered = renderMarkdown(tokens);

  return <div>{rendered}</div>;
};

export default Display;
