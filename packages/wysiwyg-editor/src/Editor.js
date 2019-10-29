import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor as SlateEditor } from 'slate-react';
import { SharedAppConsumer, serializer } from './App';
import InsertImages from 'slate-drop-or-paste-images';
import InsertBlockOnEnter from 'slate-insert-block-on-enter';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node,
};

const defaultProps = {
  as: 'div',
};

class Editor extends React.Component {
  render() {
    const { as: Component, className } = this.props;
    return (
      <Component className={classNames(className, 'ow-wysiwyg-editor')}>
        <SharedAppConsumer>
          {props => {
            return (
              <React.Fragment>
                <SlateEditor
                  // onBlur={props.offsetSet}
                  // onFocus={props.offsetSet}
                  style={{ width: '100%' }}
                  spellCheck
                  autoFocus
                  placeholder="Enter some text..."
                  ref={props.ref}
                  value={props.value}
                  onChange={props.onChange}
                  // schema={schema}
                  // plugins={plugins}
                  // onKeyDown={props.onKeyDown}
                  renderBlock={props.renderBlock}
                  renderMark={props.renderMark}
                  // onDrop={}
                  onDrop={props.onDrop}
                  onPaste={props.onPaste}
                  renderInline={props.renderInline}
                />
                {/* {serializer.serialize(props.value)} */}
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
