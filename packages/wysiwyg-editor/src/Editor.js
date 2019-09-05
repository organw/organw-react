import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor as SlateEditor } from 'slate-react';
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
  state = {
    value: Value.fromJSON(initialValue),
  };

  render() {
    const { as: Component, className, role, children } = this.props;
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
                value={props.value}
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
