import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Editor as SlateEditor } from 'slate-react'
import { Value } from 'slate'

import initialValue from './defaultValue.json'
import { isKeyHotkey } from 'is-hotkey'

import { SharedAppConsumer } from './App'

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

const propTypes = {
    className: PropTypes.string,
    as: PropTypes.elementType,
    children: PropTypes.node
  };
  
const defaultProps = {
    as: 'div',
};

class Editor extends React.Component {

    state = {
      value: Value.fromJSON(initialValue),
    }
  
    hasMark = type => {
      const { value } = this.state
      return value.activeMarks.some(mark => mark.type === type)
    }
  
    hasBlock = type => {
      const { value } = this.state
      return value.blocks.some(node => node.type === type)
    }
  
    render() {
        const { as: Component, className, role, children, ...props } = this.props;
      return (
          <div
            className={
              classNames(
                className,
                'ow-wysiwyg-editor',
            )}
          >
            <SharedAppConsumer>
              {props => {
                return  <SlateEditor
                  spellCheck
                  autoFocus
                  placeholder="Kezdj el gépelni..."
                  ref={props.ref}
                  value={props.value}
                  onChange={props.onChange}
                  onKeyDown={this.onKeyDown}
                  renderBlock={this.renderBlock}
                  renderMark={this.renderMark}
                />
              }}
              </SharedAppConsumer>
          </div>
      )
    }
  
    renderMarkButton = (type, icon) => {
      const isActive = this.hasMark(type)
  
      return (
        <button
          active={isActive}
          onMouseDown={event => this.onClickMark(event, type)}
        >
        <i className={"fa fa-" + icon} aria-hidden="true" />
        </button>
      )
    }
  
    renderBlockButton = (type, icon, text) => {
      let isActive = this.hasBlock(type)
  
      if (['numbered-list', 'bulleted-list'].includes(type)) {
        const { value: { document, blocks } } = this.state
  
        if (blocks.size > 0) {
          const parent = document.getParent(blocks.first().key)
          isActive = this.hasBlock('list-item') && parent && parent.type === type
        }
      }
  
      return (
        <button
          active={isActive}
          onMouseDown={event => this.onClickBlock(event, type)}
        >
          {text}
        </button>
      )
    }
  
    renderBlock = (props, editor, next) => {
      const { attributes, children, node } = props
  
      switch (node.type) {
        case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
        case 'heading-one':
          return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
          return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
          return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
          return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
          return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
          return <h6 {...attributes}>{children}</h6>
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'numbered-list':
          return <ol {...attributes}>{children}</ol>
        default:
          return next()
      }
    }
  
    renderMark = (props, editor, next) => {
      const { children, mark, attributes } = props
  
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{children}</strong>
        case 'code':
          return <code {...attributes}>{children}</code>
        case 'italic':
          return <em {...attributes}>{children}</em>
        case 'underlined':
          return <u {...attributes}>{children}</u>
        default:
          return next()
      }
    }
  
    onKeyDown = (event, editor, next) => {
      let mark
  
      if (isBoldHotkey(event)) {
        mark = 'bold'
      } else if (isItalicHotkey(event)) {
        mark = 'italic'
      } else if (isUnderlinedHotkey(event)) {
        mark = 'underlined'
      } else if (isCodeHotkey(event)) {
        mark = 'code'
      } else {
        return next()
      }
  
      event.preventDefault()
      editor.toggleMark(mark)
    }
  
    onClickMark = (event, type) => {
      event.preventDefault()
      this.editor.toggleMark(type)
    }
  
    onClickBlock = (event, type) => {
      event.preventDefault()
  
      const { editor } = this
      const { value } = editor
      const { document } = value
  
      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = this.hasBlock(type)
        const isList = this.hasBlock('list-item')
  
        if (isList) {
          editor
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else {
          editor.setBlocks(isActive ? DEFAULT_NODE : type)
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock('list-item')
        const isType = value.blocks.some(block => {
          return !!document.getClosest(block.key, parent => parent.type === type)
        })
  
        if (isList && isType) {
          editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else if (isList) {
          editor
            .unwrapBlock(
              type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
            )
            .wrapBlock(type)
        } else {
          editor.setBlocks('list-item').wrapBlock(type)
        }
      }
    }
  }

Editor.propTypes = propTypes;
Editor.defaultProps = defaultProps;

export default Editor
