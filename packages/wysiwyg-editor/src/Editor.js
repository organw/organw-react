import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor as SlateEditor } from 'slate-react';
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
  blocks: {
    image: {
      isVoid: true,
    },
    float_left: {
      isVoid: true,
    },
    float_right: {
      isVoid: true,
    },
  },
  inlines: {
    float_left: {
      isVoid: true,
    },
    float_right: {
      isVoid: true,
    },
  },
};

class Editor extends React.Component {
  render() {
    const { as: Component, className } = this.props;
    return (
      <Component className={classNames(className, 'ow-wysiwyg-editor')}>
        <SharedAppConsumer>
          {propps => {
            return (
              <SlateEditor
                style={{ width: '100%' }}
                spellCheck
                autoFocus
                placeholder="Enter some text..."
                ref={propps.ref}
                value={propps.value}
                onChange={propps.onChange}
                schema={schema}
                renderBlock={propps.renderBlock}
                renderMark={propps.renderMark}
                onDrop={propps.onDropOrPaste}
                onPaste={propps.onDropOrPaste}
                renderInline={propps.renderInline}
              />
            );
          }}
        </SharedAppConsumer>
      </Component>
    );
  }
}

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor;
