import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Html from 'slate-html-serializer';
import { getEventTransfer, findDOMNode } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { Button, Icon, Menu } from './components';
import { css } from 'emotion';
import { Block } from 'slate';
import { notDeepEqual } from 'assert';
// import { AlignmentPlugin } from '@slate-editor/alignment-plugin';

// import { insertColumn, insertRow, insertTable } from './table';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  role: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.object.isRequired,
};

const defaultProps = {
  as: 'div',
  role: 'application',
};

const DEFAULT_NODE = '';
const initialValue = '<div></div>';
const SharedAppContext = React.createContext({});

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

// ALIGN CENTER

function wrapAlignCenter(editor) {
  editor.wrapBlock({
    type: 'align-center',
    data: { editor },
  });

  editor.moveToEnd();
}

function unwrapAlignCenter(editor) {
  editor.unwrapBlock('align-right', 'align-left', 'align-center');
}

// ALIGN LEFT

function wrapAlignLeft(editor, type) {
  editor.wrapBlock(type);
}

function unwrapAlignLeft(editor) {
  editor.unwrapBlock('align-left');

  console.log('unwrappolva');
}

// ALIGN RIGHT

function wrapAlignRight(editor) {
  editor.wrapBlock({
    type: 'align-right',
    data: { editor },
  });

  editor.moveToEnd();
}

function unwrapAlignRight(editor) {
  editor.unwrapBlock('align-right', 'align-left', 'align-center');
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

const BLOCK_TAGS = {
  span: 'span',
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
  table: 'table',
  tr: 'table-row',
  td: 'table-cell',
  a: 'link',
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
};

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];

      if (block) {
        return {
          object: 'block',
          type: block,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj, children, next, attributes, isFocused) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'code':
            return (
              <pre>
                <code>{children}</code>
              </pre>
            );
          case 'span':
            return (
              <span className={obj.data.get('className')}>{children}</span>
            );
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>;
          case 'block-quote':
            return <blockquote>{children}</blockquote>;
          case 'heading-one':
            return <h1 className={obj.data.get('className')}>{children}</h1>;
          case 'heading-two':
            return <h2 className={obj.data.get('className')}>{children}</h2>;
          case 'heading-three':
            return <h3>{children}</h3>;
          case 'heading-four':
            return <h4>{children}</h4>;
          case 'heading-five':
            return <h5>{children}</h5>;
          case 'heading-six':
            return <h6>{children}</h6>;
          case 'list-item':
            return <li>{children}</li>;
          case 'bulleted-list':
            return (
              <ul>
                <li>{children}</li>
              </ul>
            );
          case 'numbered-list':
            return (
              <ol>
                <li>{children}</li>
              </ol>
            );
          case 'line-break':
            return <br />;
          case 'image': {
            const src = obj.data.get('src');
            return (
              <img
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
          case 'align-left':
            return (
              <p align="left" {...attributes}>
                {children}
              </p>
            );
          case 'align-center':
            return (
              <p align="center" {...attributes}>
                {children}
              </p>
            );
          case 'align-right':
            return (
              <p align="right" {...attributes}>
                {children}
              </p>
            );
          default:
            return <p {...attributes}>{children}</p>;
        }
      }
      if (obj.type === 'inline') {
        switch (obj.type) {
          case 'link': {
            const { data } = obj;
            const href = data.get('href');
            return (
              <a {...attributes} href={href}>
                {children}
              </a>
            );
          }

          default:
            return <p {...attributes}>{children}</p>;
        }
      }
      if (obj.type === 'align') {
        console.log(obj.type);
        switch (obj.type) {
          case 'align-center': {
            return (
              <p align="center" {...attributes} href={href}>
                {children}
              </p>
            );
          }
          case 'align-left': {
            return (
              <p align="left" {...attributes} href={href}>
                {children}
              </p>
            );
          }
          case 'align-right': {
            return (
              <p align="right" {...attributes} href={href}>
                {children}
              </p>
            );
          }

          default:
            return <p {...attributes}>{children}</p>;
        }
      }
      if (obj.object == 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong {...attributes}>{children}</strong>;
          case 'code':
            return <code {...attributes}>{children}</code>;
          case 'italic':
            return <em {...attributes}>{children}</em>;
          case 'underlined':
            return <u {...attributes}>{children}</u>;
          case 'line-break':
            return <br />;
          default:
            return <p {...attributes}>{children}</p>;
          case 'align-left':
            return (
              <p align="left" {...attributes}>
                {children}
              </p>
            );
          case 'align-center':
            return (
              <p align="center" {...attributes}>
                {children}
              </p>
            );
          case 'align-right':
            return (
              <p align="right" {...attributes}>
                {children}
              </p>
            );
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
        };
      }
    },
    serialize(obj, children) {
      if (obj.object == 'image') {
        switch (obj.object) {
          case 'image': {
            const { data } = obj;
            const href = data.get('href');
            return (
              <a {...attributes} href={href}>
                {children}
              </a>
            );
          }
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
        };
      }
    },
    serialize(obj, children) {
      if (obj.object === 'inline') {
        switch (obj.type) {
          case 'link': {
            const { data } = obj;
            const href = data.get('href');
            return <a href={href}>{children}</a>;
          }
        }
      }
    },
  },
];

export const serializer = new Html({ rules: RULES });

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: serializer.deserialize(initialValue),
      wordCount: null,
    };
  }

  menuRef = React.createRef();

  componentDidMount = () => {
    this.updateMenu();
  };

  componentDidUpdate = () => {
    this.updateMenu();
  };

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

  onInsertTable = () => {
    insertTable();
  };
  onInsertColumn = () => {
    insertColumn();
  };

  onInsertRow = () => {
    insertRow();
  };

  onRemoveColumn = () => {
    this.editor.removeColumn();
  };

  onRemoveRow = () => {
    this.editor.removeRow();
  };

  onRemoveTable = () => {
    this.editor.removeTable();
  };

  onToggleHeaders = () => {
    this.editor.toggleTableHeaders();
  };

  // onChange = ({ value }) => {
  //   // When the document changes, save the serialized HTML to Local Storage.
  //   if (value.document != this.state.value.document) {
  //     const string = serializer.serialize(value);
  //     localStorage.setItem('content', string);
  //   }

  //   this.setState({ value });
  // };

  // onKeyDown = (event, editor, next) => {
  //   let mark;

  //   if (isBoldHotkey(event)) {
  //     mark = 'bold';
  //   } else if (isItalicHotkey(event)) {
  //     mark = 'italic';
  //   } else if (isUnderlinedHotkey(event)) {
  //     mark = 'underlined';
  //   } else if (isCodeHotkey(event)) {
  //     mark = 'code';
  //   } else {
  //     return next();
  //   }

  //   event.preventDefault();
  //   editor.toggleMark(mark);
  // };

  wordCount = (props, editor, next) => {
    const { value } = editor;
    const { document } = value;
    const children = next();
    let wordCount = 0;

    for (const [node] of document.blocks({ onlyLeaves: true })) {
      const words = node.text.trim().split(/\s+/);
      wordCount += words.length;
    }
    return wordCount;
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

    switch (node.type) {
      case 'span':
        return <span {...attributes}>{children}</span>;
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return (
          <ul {...attributes}>
            <li>{children}</li>
          </ul>
        );
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
        return (
          <ol {...attributes}>
            <li>{children}</li>
          </ol>
        );
      case 'line-break':
        return <br />;
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
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      }
      case 'align-left':
        return (
          <p align="left" {...attributes}>
            {children}
          </p>
        );
      case 'align-center':
        return (
          <p align="center" {...attributes}>
            {children}
          </p>
        );
      case 'align-right':
        return (
          <p align="right" {...attributes}>
            {children}
          </p>
        );
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
      case 'align-left':
        return (
          <p align="left" {...attributes}>
            {children}
          </p>
        );
      case 'align-center':
        return (
          <p align="center" {...attributes}>
            {children}
          </p>
        );
      case 'align-right':
        return (
          <p align="right" {...attributes}>
            {children}
          </p>
        );
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
      case 'line-break':
        return <br />;
      default:
        return next();
    }
  };

  onClickText = (event, type, tag) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const { document } = value;
    editor.insertText(tag);
  };

  onClickBlock = (event, type, name, tag) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;
    let { isAligned } = 'undefined';
    let { listTrue } = 'undefined';

    if (type === 'text') editor.insertText(tag);

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isList = value.blocks.some(block => {
        editor.unwrapBlock('bulleted-list');
        editor.unwrapBlock('numbered-list');
        return block.type === 'list-item';
      });

      const isType = value.blocks.some(block => {
        return block.type === name;
      });
      listTrue = value.blocks.some(block => {
        if (
          block.type === 'align-left' ||
          block.type === 'align-right' ||
          block.type === 'align-center'
        ) {
          if (
            name === 'align-left' ||
            name === 'align-right' ||
            name === 'align-center'
          ) {
            console.log('1-es if ág');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.unwrapBlock('align-center');
            editor.setBlocks('paragraph');
          } else {
            console.log('1-es else ág');
            editor.setBlocks(name);
            editor.wrapBlock(block.type);
          }
        }
        if (
          block.type === 'heading-one' ||
          block.type === 'heading-two' ||
          block.type === 'heading-three' ||
          block.type === 'heading-four' ||
          block.type === 'heading-five'
        ) {
          if (
            name === 'heading-one' ||
            name === 'heading-two' ||
            name === 'heading-three' ||
            name === 'heading-four' ||
            name === 'heading-five'
          ) {
            console.log('2-es if ág');
            editor
              .unwrapBlock('align-center')
              .unwrapBlock('align-left')
              .unwrapBlock('align-right')
              .unwrapBlock('heading-one')
              .unwrapBlock('heading-two')
              .unwrapBlock('heading-three')
              .unwrapBlock('heading-four')
              .unwrapBlock('heading-five')
              .setBlocks('paragraph');
          }
          if (
            name === 'align-center' ||
            name === 'align-right' ||
            name === 'align-left'
          ) {
            console.log('2.2-es if ág');
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.setBlocks(block.type);
            editor.wrapBlock(name);
          }
        }
        if (
          block.type === 'bulleted-list' ||
          block.type === 'numbered-list' ||
          block.type === 'list-item'
        ) {
          if (
            name === 'bulleted-list' ||
            name === 'numbered-list' ||
            name === 'list-item'
          ) {
            console.log('3-as if ág');
            console.log('Blocktype: ', block.type);
            console.log('Name: ', name);
            editor.unwrapBlock('bulleted-list');
            editor.unwrapBlock('numbered-list');
            editor.unwrapBlock('list-item');
            editor.setBlocks('paragraph');
          }
          if (
            name === 'align-center' ||
            name === 'align-left' ||
            name === 'align-right'
          ) {
            console.log('Blocktype: ', block.type);
            console.log('Name: ', name);
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.setBlocks(block.type);
            editor.wrapBlock(name);
          } else {
            console.log('3-as else ág');
            console.log('Blocktype: ', block.type);
            console.log('Name: ', name);
            editor.unwrapBlock('bulleted-list');
            editor.unwrapBlock('numbered-list');
            editor.unwrapBlock('list-item');
            editor.setBlocks('paragraph');
          }
        }
        if (block.type === 'paragraph') {
          console.log('paragraph if ág');
          editor.unwrapBlock('heading-one');
          editor.unwrapBlock('heading-two');
          editor.unwrapBlock('heading-three');
          editor.unwrapBlock('heading-four');
          editor.unwrapBlock('heading-five');
          editor.unwrapBlock('align-center');
          editor.unwrapBlock('align-left');
          editor.unwrapBlock('align-right');
          editor.unwrapBlock('bulleted-list');
          editor.unwrapBlock('numbered-list');
          editor.unwrapBlock('list-item');
          editor.setBlocks(name);
        }
        if (block.type === 'image') {
          if (
            name === 'align-center' ||
            name === 'align-left' ||
            name === 'align-right'
          ) {
            console.log('5-es if ág');
            editor.setBlocks(block.type);
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.wrapBlock(name);
          }
         
        }

        return listTrue;
      });
    }
  };

  onClickImage = event => {
    event.preventDefault();
    const src = window.prompt('Írja be a kép URL címét!');
    if (!src) return;
    this.editor.command(insertImage, src);
    this.editor.wrapBlock('paragraph');
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

    if (this.hasLinks()) {
      editor.command(unwrapLink);
    }

    editor.command(wrapLink, text);
  };

  onClickLink = event => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const hasLinks = this.hasLinks();

    if (hasLinks) {
      editor.command(unwrapLink);
    } else if (value.selection.isExpanded) {
      const href = window.prompt('Enter the URL of the link:');

      if (href == null) {
        return;
      }

      editor.command(wrapLink, href);
    } else {
      const href = window.prompt('Enter the URL of the link:');

      if (href == null) {
        return;
      }

      const text = window.prompt('Enter the text for the link:');

      if (text == null) {
        return;
      }

      editor
        .insertText(text)
        .moveFocusBackward(text.length)
        .command(wrapLink, href);
    }
  };

  onClickMark = (event, type, name) => {
    event.preventDefault();
    console.log('TYPE2', type);
    this.editor.toggleMark(type);
  };

  hasMark = type => {
    const { value } = this.state;
    return value.activeMarks.some(mark => {
      mark.type === type;
    });
  };

  hasBlock = type => {
    const { value } = this.state;
    return props.value.blocks.some(node => node.type === type);
  };

  hasLinks = () => {
    const { value } = this.state;
    return value.inlines.some(inline => inline.type === 'link');
  };

  onKeyDown = (event, editor, next) => {
    console.log('KEy: ', event.key);
    const { value } = editor;
    const { document, selection } = value;
    const { start, isCollapsed } = selection;
    const startNode = document.getDescendant(start.key);

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

  listTrue = () => {
    const { editor } = this.editor;
    const { value } = editor;
    // return value.blocks.some(node => {
    //   if (
    //     node.type === 'bulleted-list' ||
    //     node.type === 'numbered-list' ||
    //     notDeepEqual.type === 'list-item'
    //   ) {
    //     console.log(node.type);
    //     // editor.unwrapBlock('bulleted-list');
    //     // editor.unwrapBlock('numbered-list');
    //     // editor.unwrapBlock('list-item');
    //     // editor.moveFocusBackward(1);
    //     editor.insertBlock('list-item');
    //   } else {
    //     console.log('nem list enter');
    //     editor.insertBlock('paragraph');
    //     editor.unwrapBlock('line-break');
    //   }
    // });
  };

  onEnter = (event, editor, node, next, type) => {
    const { value } = editor;
    // this.listTrue();
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
    editor.delete();
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

  hasBlock = name => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === name);
  };

  // offsetSet = () => {
  //   console.log(this.editor.value.selection.anchor.offset);

  //   const selection = window.getSelection();
  //   const parentNode = document.getElementsByClassName('ow-wysiwyg-editor');
  //   if (parentNode[0].children[0].innerText === 'Enter some text...') {
  //     parentNode[0].children[0].innerText.length === 0;
  //   }
  //   console.log(parentNode[0].children[0].innerText);
  //   console.log(parentNode[0].children[0].innerText.length);
  //   const range = document.createRange();
  //   console.log(this.editor.value.selection.anchor.offset);
  //   range.setStart(
  //     parentNode[0].children[0],
  //     toString(this.editor.value.selection.anchor.offset)
  //   );
  //   range.setEnd(parentNode[0].children[0], 1);

  //   selection.addRange(range);
  // };

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
            value: props.value,
            ref: this.ref,
            editor: this.editor,
            onChange: props.onChange,
            onKeyDown: this.onKeyDown,
            renderBlock: this.renderBlock,
            renderMark: this.renderMark,
            // isBoldHotkey: this.isBoldHotkey,
            // isItalicHotkey: this.isBoldHotkey,
            // isUnderlinedHotkey: this.isUnderlinedHotkey,
            // isCodeHotkey: this.dsCodeHotkey,
            hasBlock: this.hasBlock,
            hasLinks: this.hasLinks,
            onClickBlock: this.onClickBlock,
            onClickMark: this.onClickMark,
            onDrop: this.onDropOrPasteImg,
            onPaste: this.onPaste,
            onClickLink: this.onClickLink,
            onClickText: this.onClickText,
            onClickImage: this.onClickImage,
            renderInline: this.renderInline,
            offsetSet: this.offsetSet,

            // onInsertTable: this.onInsertTable,
            // onInsertRow: this.onInsertRow,
            // onInsertColumn: this.onInsertColumn,
            // renderEditor: this.renderEditor,
            // wordCount: this.state.wordCount,
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
