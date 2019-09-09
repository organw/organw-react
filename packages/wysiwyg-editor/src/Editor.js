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
  },
};

class Editor extends React.Component {
  render() {
    const { as: Component, className } = this.props;
    return (
      <Component className={classNames(className, 'ow-wysiwyg-editor')}>
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
                hasLink={props.hasLink}
                onClickBlock={props.onClickBlock}
                // onClickImage={props.onClickImage}
                // renderEditor={props.renderEditor}
                wordCount={props.wordCount}
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
