import { Token } from './types';
import { createElement } from 'react';

const renderNodeWithKey = (node: Token, key: number): JSX.Element | string => renderNode(node, key);

const renderNode = (node: Token, key: number): JSX.Element | string => {
  switch (node.type) {
    case 'text':
      return node.text;
    case 'boldItalic':
      return (
        <b className="bold" key={key}>
          <i className="italic">{node.children.map(renderNodeWithKey)}</i>
        </b>
      );
    case 'bold':
      return (
        <b className="bold" key={key}>
          {node.children.map(renderNodeWithKey)}
        </b>
      );
    case 'italic':
      return (
        <i className="italic" key={key}>
          {node.children.map(renderNodeWithKey)}
        </i>
      );
    case 'code':
      return (
        <code className="code" key={key}>
          {node.children.map(renderNodeWithKey)}
        </code>
      );
    case 'header':
      return createElement(
        `h${node.level}`,
        { className: `h${node.level}`, key },
        node.children.map(renderNodeWithKey)
      );
    case 'blockquote':
      return (
        <blockquote className="blockquote" key={key}>
          {node.children.map(renderNodeWithKey)}
        </blockquote>
      );
    case 'paragraph':
      return (
        <p className="paragraph" key={key}>
          {node.children.map(renderNodeWithKey)}
        </p>
      );
    default:
      return '';
  }
};

const renderMarkdown = (tokens: Token[]): JSX.Element => {
  return <>{tokens.map(renderNodeWithKey)}</>;
};

export { renderMarkdown };
