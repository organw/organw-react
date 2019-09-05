import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Value } from 'slate';
import { getEventTransfer } from 'slate-react';
import initialValue from './defaultValue.json';
import { isKeyHotkey } from 'is-hotkey';
import Plain from 'slate-plain-serializer';
import { Button, Icon, Menu } from './components';
import { css } from 'emotion';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  role: PropTypes.string,
  children: PropTypes.node,
};

const defaultProps = {
  as: 'div',
  role: 'application',
};

const DEFAULT_NODE = 'span';

const SharedAppContext = React.createContext();
const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

function wrapLink(editor, href) {
  editor.wrapInline({
    type: 'link',
    data: { href },
  });

  editor.moveToEnd();
}

/**
 * A change helper to standardize unwrapping links.
 *
 * @param {Editor} editor
 */

function unwrapLink(editor) {
  editor.unwrapInline('link');
}

const MarkButton = ({ editor, type, icon }) => {
  const { value } = editor;
  const isActive = value.activeMarks.some(mark => mark.type === type);
  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault();
        editor.toggleMark(type);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const HoverMenu = React.forwardRef(({ editor }, ref) => {
  const root = window.document.getElementById('root');
  return ReactDOM.createPortal(
    <Menu
      ref={ref}
      className={css`
        padding: 8px 7px 6px;
        width: 40%;
        position: sticky;
        z-index: 1;
        top: -10000px;
        left: -10000px;
        margin-top: -6px;
        opacity: 0;
        background-color: #222;
        border-radius: 4px;
        transition: opacity 0.75s;
      `}
    >
      <MarkButton editor={editor} type="bold" icon="format_bold" />
      <MarkButton editor={editor} type="italic" icon="format_italic" />
      <MarkButton editor={editor} type="underlined" icon="format_underlined" />
      <MarkButton editor={editor} type="code" icon="code" />
    </Menu>,
    root
  );
});

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target);
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  });
}

function isImage(url) {
  return imageExtensions.includes(getExtension(url));
}

function getExtension(url) {
  return new URL(url).pathname.split('.').pop();
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: Value.fromJSON(initialValue),
    };
  }

  menuRef = React.createRef();

  /**
   * On update, update the menu.
   */

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

  /**
   * Update the menu's absolute position.
   */

  updateMenu = () => {
    const menu = this.menuRef.current;
    if (!menu) return;

    const { value } = this.state;
    const { fragment, selection } = value;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style');
      return;
    }

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`;

    menu.style.left = `${rect.left +
      window.pageXOffset -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  };

  ref = editor => {
    this.editor = editor;
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  renderEditor = (props, editor, next) => {
    const children = next();
    return (
      <React.Fragment>
        {children}
        <HoverMenu ref={this.menuRef} editor={editor} />
      </React.Fragment>
    );
  };

  renderBlock = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;
    console.log(attributes);
    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'heading-three':
        return <h3 {...attributes}>{children}</h3>;
      case 'heading-four':
        return <h4 {...attributes}>{children}</h4>;
      case 'heading-five':
        return <h5 {...attributes}>{children}</h5>;
      case 'heading-six':
        return <h6 {...attributes}>{children}</h6>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'table':
        console.log(children);
        return (
          <table className="table-striped">
            <tbody {...attributes}>
              <tr>
                <td>{children}</td>
              </tr>
            </tbody>
          </table>
        );
      case 'table-row':
        return <tr {...attributes}>{children}</tr>;
      case 'table-cell':
        return <td {...attributes}>{children}</td>;
      case 'image': {
        const src = node.data.get('src');
        return (
          <img
            {...attributes}
            src={src}
            className={css`
              display: block;
              max-width: 100%;
              max-height: 20em;
              box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
            `}
          />
        );
      }
      default:
        return next();
    }
  };

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  onClickBlock = (event, type, name) => {
    event.preventDefault();
    console.log('block megnyomva', type);

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');
      console.log(isList);
      console.log(isActive);

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
          .unwrapBlock('list-item');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
          .unwrapBlock('list-item');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <i className={'fa fa-' + icon} aria-hidden="true" />
      </button>
    );
  };

  renderBlockButton = (type, icon, text) => {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list', 'list-item'].includes(type)) {
      const {
        value: { document, blocks },
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    return <button active={isActive}>{text}</button>;
  };

  renderInline = (props, editor, next) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      }

      default: {
        return next();
      }
    }
  };

  onClickLink = event => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const hasLinks = this.hasLinks();

    if (hasLinks) {
      editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      const href = window.prompt('Írja be az URL címet:');

      if (href == null) {
        return;
      }

      editor.command(wrapLink, href);
    } else {
      const href = window.prompt('Írja be az URL címet:');

      if (href == null) {
        return;
      }

      const text = window.prompt('Írja be a linkhez megjelenő szöveget:');

      if (text == null) {
        return;
      }

      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command(wrapLink, href);
    }
  };

  onClickImage = event => {
    event.preventDefault();
    const src = window.prompt('Enter the URL of the image:');
    if (!src) return;
    this.editor.command(insertImage, src);
  };

  onDropOrPasteImg = (event, editor, next) => {
    const target = editor.findEventRange(event);
    if (!target && event.type === 'drop') return next();

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type === 'files') {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');
        if (mime !== 'image') continue;

        reader.addEventListener('load', () => {
          editor.command(insertImage, reader.result, target);
        });

        reader.readAsDataURL(file);
      }
      return;
    }

    if (type === 'text') {
      if (!isUrl(text)) return next();
      if (!isImage(text)) return next();
      editor.command(insertImage, text, target);
      return;
    }

    next();
  };

  onPaste = (event, editor, next) => {
    if (editor.value.selection.isCollapsed) return next();

    const transfer = getEventTransfer(event);
    const { type, text } = transfer;
    if (type !== 'text' && type !== 'html') return next();
    if (!isUrl(text)) return next();

    if (this.hasLinks()) {
      editor.command(unwrapLink);
    }

    editor.command(wrapLink, text);
  };

  onClickMark = (event, type) => {
    console.log(event, type);
    if (type === 'table') {
      this.onDropOrPaste();
    } else {
      event.preventDefault();
      this.editor.toggleMark(type);
    }
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => {
      mark.type === type;
    });
  };

  hasBlock = type => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  };

  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === 'link');
  };

  onDropOrPaste = (event, editor, name, next) => {
    // if (editor.value.selection.isCollapsed) return next();
    const transfer = getEventTransfer(event);
    const { type, text = '' } = transfer;
    const { value } = editor;
    if (value.startBlock.type !== 'table-cell') {
      return next();
    }

    if (!text) {
      return next();
    }

    const lines = text.split('\n');
    const { document } = Plain.deserialize(lines[0] || '');
    console.log(document);
    editor.insertFragment(document);
  };

  onEnter = (event, editor, next) => {
    event.preventDefault();
  };

  onKeyDown = (event, editor, next) => {
    const { value } = editor;
    const { document, selection } = value;
    const { start, isCollapsed } = selection;
    const startNode = document.getDescendant(start.key);

    if (isCollapsed && start.isAtStartOfNode(startNode)) {
      const previous = document.getPreviousText(startNode.key);

      if (!previous) {
        return next();
      }

      const prevBlock = document.getClosestBlock(previous.key);

      if (prevBlock.type === 'table-cell') {
        if (['Backspace', 'Delete', 'Enter'].includes(event.key)) {
          event.preventDefault();
        } else {
          return next();
        }
      }
    }

    if (value.startBlock.type !== 'table-cell') {
      return next();
    }

    switch (event.key) {
      case 'Backspace':
        return this.onBackspace(event, editor, next);
      case 'Delete':
        return this.onDelete(event, editor, next);
      case 'Enter':
        return this.onEnter(event, editor, next);
      default:
        return next();
    }
  };

  onDelete = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    if (selection.end.offset !== value.startText.text.length) return next();
    event.preventDefault();
  };

  onBackspace = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    if (selection.start.offset !== 0) return next();
    event.preventDefault();
  };

  render() {
    const { as: Component, className, role, children, ...props } = this.props;

    return (
      <Component
        {...props}
        role={role}
        className={classNames(className, 'ow-wysiwyg-app')}
      >
        <SharedAppContext.Provider
          value={{
            value: this.state.value,
            ref: this.ref,
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            renderBlock: this.renderBlock,
            renderMark: this.renderMark,
            isBoldHotkey: isBoldHotkey,
            isItalicHotkey: isBoldHotkey,
            isUnderlinedHotkey: isUnderlinedHotkey,
            isCodeHotkey: isCodeHotkey,
            onClickBlock: this.onClickBlock,
            renderMarkButton: this.renderMarkButton,
            renderBlockButton: this.renderBlockButton,
            onClickMark: this.onClickMark,
            hasBlock: this.hasBlock,
            hasMark: this.hasMark,
            onDrop: this.onDropOrPasteImg,
            onPaste: this.onPaste,
            renderInline: this.renderInline,
            onClickLink: this.onClickLink,
            onClickImage: this.onClickImage,
            // renderEditor: this.renderEditor,
          }}
        >
          {children}
        </SharedAppContext.Provider>
      </Component>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export const SharedAppConsumer = SharedAppContext.Consumer;
export default App;
