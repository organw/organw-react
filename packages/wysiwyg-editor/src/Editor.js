import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor as SlateEditor } from 'slate-react';
import Html from 'slate-html-serializer'
import { Value, Block } from 'slate';
import initialValue from './defaultValue.json';
import { SharedAppConsumer } from './App';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node,
};

const defaultProps = {
  as: 'div',
};

const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
}

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
}

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()]

      if (block) {
        return {
          object: 'block',
          type: block,
          nodes: next(el.childNodes),
        }
      }
    },
  },
  {
    deserialize(el, next) {
      const mark = MARK_TAGS[el.tagName.toLowerCase()]

      if (mark) {
        return {
          object: 'mark',
          type: mark,
          nodes: next(el.childNodes),
        }
      }
    },
  },
  {
    // Special case for code blocks, which need to grab the nested childNodes.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'pre') {
        const code = el.childNodes[0]
        const childNodes =
          code && code.tagName.toLowerCase() === 'code'
            ? code.childNodes
            : el.childNodes

        return {
          object: 'block',
          type: 'code',
          nodes: next(childNodes),
        }
      }
    },
  },
  {
    // Special case for images, to grab their src.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'img') {
        return {
          object: 'block',
          type: 'image',
          nodes: next(el.childNodes),
          data: {
            src: el.getAttribute('src'),
          },
        }
      }
    },
  },
  {
    // Special case for links, to grab their href.
    deserialize(el, next) {
      if (el.tagName.toLowerCase() === 'a') {
        return {
          object: 'inline',
          type: 'link',
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute('href'),
          },
        }
      }
    },
  },
]

const serializer = new Html({ rules: RULES })

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph');
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph);
        }
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
  },
};

class Editor extends React.Component {
  render() {
    const { as: Component, className, role, children, text } = this.props;
    return (
      <div className={classNames(className, 'ow-wysiwyg-editor')}>
        <SharedAppConsumer>
          {props => {
            return (
              <SlateEditor
                spellCheck
                autoFocus
                placeholder="Kezdj el gépelni..."
                ref={props.ref}
                value={serializer.deserialize(props.value)}
                onChange={props.onChange}
                schema={schema}
                onKeyDown={props.onKeyDown}
                renderBlock={props.renderBlock}
                renderMark={props.renderMark}
                onDrop={props.onDrop}
                onPaste={props.onPaste}
                renderInline={props.renderInline}
                // onClickBlock={props.onClickBlock}
                // onClickImage={props.onClickImage}
                // renderEditor={props.renderEditor}
                wordCount={props.wordCount}
              />
            );
          }}
        </SharedAppConsumer>
      </div>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
