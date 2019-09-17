import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor as SlateEditor } from 'slate-react';
import { SharedAppConsumer, serializer } from './App';
import { offset } from './App.story';

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
  selectRangeBackwards = () => {
    var sel = document.getSelection();
    let range = document.createRange();
    range.collapse(false);

    sel.extend(range.startContainer, range.startOffset);
    console.log(range);
  };

  render() {
    const { as: Component, className } = this.props;
    return (
      <Component className={classNames(className, 'ow-wysiwyg-editor')}>
        <SharedAppConsumer>
          {props => {
            return (
              <React.Fragment>
                <SlateEditor
                  onClick={this.selectRangeBackwards}
                  style={{ width: '100%' }}
                  spellCheck
                  autoFocus
                  placeholder="Enter some text..."
                  ref={props.ref}
                  value={props.value}
                  onFocus={props.offsetSet}
                  onChange={props.onChange}
                  schema={schema}
                  onKeyDown={props.onKeyDown}
                  renderBlock={props.renderBlock}
                  renderMark={props.renderMark}
                  onDrop={props.onDrop}
                  onPaste={props.onPaste}
                  renderInline={props.renderInline}
                  // hasLinks={props.hasLinks}
                  // onClickBlock={props.onClickBlock}
                  // onDropOrPaste={props.onDropOrPaste}
                  // onClickImage={props.onClickImage}
                  // renderEditor={props.renderEditor}
                  // wordCount={props.wordCount}
                />
                {serializer.serialize(props.value)}
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
