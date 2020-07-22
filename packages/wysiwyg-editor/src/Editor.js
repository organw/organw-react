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
    embed: {
      isVoid: true
    },
    button: {
      isVoid: true
    }
  },
  inlines: {
    image: {
      isVoid: true,
    },
    emoji: {
      isVoid: true
    },
    float_left: {
      isVoid: true
    },
    float_right: {
      isVoid: true
    }
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
              <React.Fragment>
                <SlateEditor
                  style={{ width: '100%' }}
                  spellCheck
                  autoFocus
                  placeholder="Enter some text..."
                  ref={propps.ref}
                  value={propps.value}
                  onChange={propps.onChange}
                  schema={schema}
                  // onKeyDown={propps.onKeyDown}
                  renderBlock={propps.renderBlock}
                  renderMark={propps.renderMark}
                  onDrop={propps.onDropOrPaste}
                  onPaste={propps.onDropOrPaste}
                  renderInline={propps.renderInline}
                />
              
              </React.Fragment>
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
