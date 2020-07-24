import React from 'react';
import PropTypes, { element, bool } from 'prop-types';
import classNames from 'classnames';
import Html from 'slate-html-serializer';
import { getEventTransfer } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { css } from 'emotion';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import DropZone from 'react-dropzone';
import './App.css'
import './simple-grid.css'
import 'font-awesome/css/font-awesome.css';
const json = require('./emoji.json');

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  role: PropTypes.string,
  children: PropTypes.array,
  value: PropTypes.object.isRequired
};

const defaultProps = {
  as: 'div',
  role: 'application',
};

// const DEFAULT_NODE = '';
const initialValue = '<div></div>';
const SharedAppContext = React.createContext({});
const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+q');
const isStriketroughHotkey = isKeyHotkey('mod+s');

function insertImage(editor, file, type, name, target) {
 
 
  if (name === 'float_left' || name === 'float_right') {
    let style = {};
    let blockStyle = {};
    let src = file.url;
    let float = name.slice(6, name.length);
    if (float === 'left') {
      style['float'] = float;
      style['margin'] = '0px 10px 10px 0px';
      style['width'] = '400px';
    }
    if (float === 'right') {
      style['float'] = float;
      style['margin'] = '0px 0px 10px 10px';
      style['width'] = '400px';
    }
    let obj = {
      object: 'inline',
      type: 'image',
      data: { 
        src: src,
        style: style,
        float: float
      },
    }
    blockStyle['whiteSpace'] = 'pre-wrap';
    blockStyle['overflowWrap'] = 'break-word';
    // blockStyle[clear] = 'both';  NEM ENGEDI AZ MÁSIK BEKEZDÉST AZ ELŐZŐ KÉPHEZ "BEFOLYNI"
    editor.insertInline({
      object: 'inline',
      type: 'image',
      data: { 
        src: src,
        style: style,
        float: float
      },
    });
    editor.wrapBlock({
      object: 'block',
      type: 'align-left',
      data: {
        style: blockStyle
      }
    });
  } else {
    let style = {}
    let src = file.url;
    let align = editor.value.focusBlock.type.slice(6, editor.value.focusBlock.type.length);
    delete style.float
    if (align === 'left') {
      delete style.float
      style['display'] = 'block';
      style['marginLeft'] = '0px';
      style['marginRight'] = 'auto';
    }
    if (align === 'center') {
      delete style.float
      style['display'] = 'block';
      style['marginLeft'] = 'auto'
      style['marginRight'] = 'auto'
    }
    if (align === 'right') {
      delete style.float
      style['display'] = 'block';
      style['marginRight'] = '0px';
      style['marginLeft'] = 'auto';
    }
    delete style.float
    editor.insertBlock({
      object: 'block',
      type: 'image',
      isVoid: true,
      data: { 
        src: src,
        style: style,
        type: 'image'
      }
    });
  }
}

function isImage(url) {
  return imageExtensions.includes(getExtension(url));
}

function getExtension(url) {
  return new URL(url).pathname.split('.').pop();
}

const BLOCK_TAGS = {
  p: 'align-left',
  p: 'align-center',
  p: 'align-right',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  img: 'image',
  q: 'quote',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
  table: 'table',
  tr: 'table_row',
  td: 'table_cell',
  button: 'button',
  iframe: 'embed',
  br: 'line-break'
};

const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  strike: 'strikethrough',
  code: 'code',
};

const INLINE_TAGS = {
  img: 'image',
  a: 'link',
  span: 'emoji'
};

let stilusok = [];

function getStilus(tagName) {
  let style = {};
  if (stilusok.length !== 0){
    stilusok.map((stilus) => {
      let activeStyles = stilus.style;
      if(stilus.tagName == tagName){
        let newObj = {}
        for (const [key, value] of Object.entries(activeStyles)) {
          if(activeStyles[key] && isNaN(key)){
            newObj[key] = activeStyles[key];
            style[key] = newObj[key];
          } 
        }
      }
    });
  }
  return style;
}

const RULES = [
  {
    deserialize(el, next) {
      const block = BLOCK_TAGS[el.tagName.toLowerCase()];
      const mark = MARK_TAGS[el.tagName.toLowerCase()];
      const inline = INLINE_TAGS[el.tagName.toLowerCase()];
     
      if (block) {
        
        let stilus = el.style;
        let style = Object.assign({}, stilus)
        let tagName = el.tagName === 'IMG' ? (el.getAttribute('align') ? 'float' : 'image') : el.tagName;
        stilusok.push({style, tagName});
        if (el.tagName === 'P') {
          const align = el.getAttribute('align');
          if(align){
            let style =  getStilus(el.tagName) ? getStilus(el.tagName) : {}
            if (align) {
              if (el.innerText === ''){
                delete style.overflowWrap;
                delete style.whiteSpace;
                delete style.wordWrap;
              }
              return {
                object: 'block',
                type: `align-${align}`,
                data: {
                  className: el.getAttribute('class'),
                  style: style !== {} ? style : { fontSize: '17px' } 
                },
                nodes: next(el.childNodes),
              }
            } else {
              return {
                object: 'block',
                type: 'paragraph',
                data: {
                  className: el.getAttribute('class'),
                  style: style !== {} ? style : { fontSize: '17px' } 
                },
                nodes: next(el.childNodes),
              }
            }
          }
        }
        if (el.tagName === 'H1') {
          let style = getStilus(el.tagName);
          return {
            object: 'block',
            type: 'heading-one',
            data: {
              className: el.getAttribute('class'),
              style: style
            },
            nodes: next(el.childNodes),
          };
        }
        if (el.tagName === 'H2') {
          let style = getStilus(el.tagName);
          return {
            object: 'block',
            type: 'heading-two',
            data: {
              className: el.getAttribute('class'),
              style: style
            },
            nodes: next(el.childNodes),
          };
        }
        if (el.tagName === 'H3') {
          let style = getStilus(el.tagName);
          return {
            object: 'block',
            type: 'heading-three',
            data: {
              className: el.getAttribute('class'),
              style: style
            },
            nodes: next(el.childNodes),
          };
        }
        if (el.tagName === 'H4') {
          let style = getStilus(el.tagName);
          return {
            object: 'block',
            type: 'heading-four',
            data: {
              className: el.getAttribute('class'),
              style: style
            },
            nodes: next(el.childNodes),
          };
        }
        if (el.tagName === 'H5') {
          let style = getStilus(el.tagName);
          return {
            object: 'block',
            type: 'heading-five',
            data: {
              className: el.getAttribute('class'),
              style: style
            },
            nodes: next(el.childNodes),
          };
        }
        if (el.tagName === 'TABLE'){
          let style = getStilus(el.tagName);
          if (style) {
            return {
              object: 'block',
              type: 'table',
              data: {
                className: el.getAttribute('class'),
                style: style
              },
              nodes: next(el.childNodes),
            }
          } else {
            return {
              object: 'block',
              type: 'table',
              data: {
                className: el.getAttribute('class'),
              },
              nodes: next(el.childNodes),
            }
          }
        }
        if (el.tagName === 'TR'){
          let style = getStilus(el.tagName);
          if (style) {
            return {
              object: 'block',
              type: 'table_row',
              data: {
                className: el.getAttribute('class'),
                style: style
              },
              nodes: next(el.childNodes),
            }
          } else {
            return {
              object: 'block',
              type: 'table_row',
              data: {
                className: el.getAttribute('class'),
              },
              nodes: next(el.childNodes),
            }
          }
        }
        if (el.tagName === 'TD'){
          let style = getStilus(el.tagName);
          if (style) {
            return {
              object: 'block',
              type: 'table_cell',
              data: {
                className: el.getAttribute('class'),
                style: style
              },
              nodes: next(el.childNodes),
            }
          } else {
            return {
              object: 'block',
              type: 'table_cell',
              data: {
                className: el.getAttribute('class'),
              },
              nodes: next(el.childNodes),
            }
          }
        }
        if (el.tagName === 'BUTTON') {
          let style = getStilus(el.tagName);
          let value = el.innerText;
          let href = el.getAttribute('href');
          el.addEventListener('click', function () { window.open(href) })
          // createEvent(el, "click", () => window.open(href));
          // el.setAttribute('onClick', () => window.open(href))
          if (style && value) {
            if (href) {
              return {
                object: 'block',
                type: 'button',
                data: {
                  className: el.getAttribute('class'),
                  style: style,
                  value: value,
                  href: href 
                },
              }
            } else {
              return {
                object: 'block',
                type: 'button',
                data: {
                  className: el.getAttribute('class'),
                  style: style,
                  value: value,
                },
              }
            }
          }
        }
        if (el.tagName === 'IFRAME') {
          let style = getStilus(el.tagName);
          let src = el.getAttribute('src');
          if (src) {
            if (style) {
              return {
                object: 'block',
                type: 'embed',
                data: {
                  style: style,
                  src: src
                },
                isVoid: true
              }
            } else {
              return {
                object: 'block',
                type: 'embed',
                data: {
                  src: src
                },
                isVoid: true
              }
            }
          }
        }
        if (el.tagName === 'IMG') {
          let float = el.getAttribute('align');
          if (!float) {
            let src = el.getAttribute('src');
            let style = getStilus('image')
            return {
              object: 'block',
              type: 'image',
              data: {
                src: src,
                style: style
              }
            }
          }
        }
        if (el.tagName === 'Q') {
          let style = getStilus(el.tagName);
            return {
              object: 'block',
              type: 'quote',
              data: {
                className: el.getAttribute('class'),
                style: style
              },
              nodes: next(el.childNodes)
            }
        }
        if (el.tagName === 'LI') {
          let parent = el.getAttribute('parent');
          let style = el.getAttribute('style');
          if (parent) {
            if (parent === 'bulleted-list') {
              return {
                object: 'block',
                type: 'list-item',
                data: {
                  parent: parent,
                  style: style
                },
                nodes: next(el.childNodes)
              }
            }
            if (parent === 'numbered-list') {
              return {
                object: 'block',
                type: 'list-item',
                data: {
                  parent: parent,
                  style: style
                },
                nodes: next(el.childNodes)
              }
            } else {
              return {
                object: 'block',
                type: 'list-item',
                data: {
                  style: style
                },
                nodes: next(el.childNodes)
              }
            }
          } else {
            return {
              object: 'block',
              type: 'list-item',
              data: {
                style: style
              },
              nodes: next(el.childNodes)
            }
          }
        }
        if (el.tagName === 'UL') {
          let style = el.getAttribute('style');
            return {
              object: 'block',
              type: 'bulleted-list',
              data: {
                style: style
              },
              nodes: next(el.childNodes)
            }
        }
        if (el.tagName === 'OL') {
          let style = el.getAttribute('style');
            return {
              object: 'block',
              type: 'numbered-list',
              data: {
                style: style
              },
              nodes: next(el.childNodes)
            }
        }
        if (el.tagName === 'BR') {
            return {
              object: 'block',
              type: 'line-break'
            }
        }
      } 
      if (mark) {
        const align = el.getAttribute('align');
        if (align) {
          return {
            object: 'block',
            type: `align-${align}`,
            data: {
              className: el.getAttribute('class')
            },
            nodes: [{
              object: 'mark',
              type: mark,
              data: {
                align: align
              },
              nodes: next(el.childNodes),
            }],
          };
        } else {
          return {
            object: 'mark',
            type: mark,
            data: {
              className: el.getAttribute('class')
            },
            nodes: next(el.childNodes),
          };
        }
      }
      if (inline) {
        if (el.tagName === 'IMG') {
          let float = el.getAttribute('align');
          if (float) {
            let style = getStilus('float')
            const src = el.getAttribute('src');
            delete style.height
            if (src) {
              if (style) {
                return {
                  object: 'inline',
                  type: `image`,
                  data: {
                    src: src,
                    style: style,
                    float: float
                  },
                  nodes: next(el.childNodes)
                };    
              }
            }    
          }
      } 
      if (el.tagName.toLowerCase() === 'a') {
        let style = getStilus(el.tagName);
        let text = el.innerText;
        if (style) {
          return {
            object: 'inline',
            type: 'link',
            nodes: next(el.childNodes),
            data: {
              href: el.getAttribute('href'),
              style: style,
              text: text
            },
          };
        } else {
          return {
            object: 'inline',
            type: 'link',
            nodes: next(el.childNodes),
            data: {
              href: el.getAttribute('href'),
              text: text
            },
          };
        }
      }
      if (el.tagName.toLowerCase() === 'span') {
        let style = getStilus(el.tagName);
        let value = el.innerText;
        if (style) {
          return {
            object: 'inline',
            type: 'emoji',
            nodes: next(el.childNodes),
            data: {
              style: style,
              value: value
            },
            nodes: next(el.childNodes),
          };
        } else {
          return {
            object: 'inline',
            type: 'emoji',
            nodes: next(el.childNodes),
            data: {
              value: value
            },
            nodes: next(el.childNodes),
          };
        }
      }
      else {
        let style = getStilus(el.tagName);
        if(style) {
          return {
            object: 'inline',
            type: inline,
            data: {
              className: el.getAttribute('class'),
              style: style
            },
          }
        } else {
          return {
            object: 'inline',
            type: inline,
            data: {
              className: el.getAttribute('class')
            },
          }
        }
      }}
    },
    serialize(obj, children, next, attributes, isFocused) {
      if (obj.object == 'block') {
        switch (obj.type) {
          case 'span':
            return (
              <span className={obj.data.get('className')}>{children}</span>
            );
          case 'line-break':
            return <br />;
          case 'heading-one': {
            const style = obj.data.get('style');
            if (style) {
              return <h1 style={style} {...attributes}>{children}</h1>;
            } else {
              return <h1 {...attributes}>{children}</h1>;
            }   
          }
          case 'heading-two': {
            const style = obj.data.get('style');
            if (style) {
              return <h2 style={style} {...attributes}>{children}</h2>;
            } else {
              return <h2 {...attributes}>{children}</h2>;
            }
          }
          case 'heading-three': {
            const style = obj.data.get('style');
            if (style) {
              return <h3 style={style} {...attributes}>{children}</h3>;
            } else {
              return <h3 {...attributes}>{children}</h3>;
            }
          }
          case 'heading-four': {
            const style = obj.data.get('style');
            if (style) {
              return <h4 style={style} {...attributes}>{children}</h4>;
            } else {
              return <h4 {...attributes}>{children}</h4>;
            }
          }
          case 'heading-five': {
            const style = obj.data.get('style');
            if (style) {
              return <h5 style={style} {...attributes}>{children}</h5>;
            } else {
              return <h5 {...attributes}>{children}</h5>;
            }
          }
          case 'paragraph': {
            let style = obj.data.get('style');
            if (style) {
              return(
                <p style={style} {...attributes}>{children}</p>
                );
            } else {
              return(
                <p {...attributes}>{children}</p>
                );
            }        
          }
          case 'quote':
            return <q>{children}</q>;
          case 'align-left': {
            let style = obj.data.get('style');
            if (style) {
              return (
                <p align="left" style={style}>
                  {children}
                </p>
              );
            } else {
              return (
                <p align="left" {...attributes }>
                  {children}
                </p>
              );
            }
          }
          case 'align-center': {
            let style = obj.data.get('style');
            if (style) {
              return (
                <p align="center" style={style} {...attributes }>
                  {children}
                </p>
              );
            } else {
              return (
                <p align="center" {...attributes }>
                  {children}
                </p>
              );
            }
          }
          case 'align-right': {
            let style = obj.data.get('style');
            if (style) {
              return (
                <p align="right" style={style} {...attributes}>
                  {children}
                </p>
              );
            } else {
              return (
                <p align="right" {...attributes}>
                  {children}
                </p>
              );
            }
          }
          case 'list-item': {
            let parent = obj.data.get('parent');
            if (parent) {
              if (parent === 'bulleted-list') {
                return (
                  <li parent={parent} {...attributes}>{children}</li>
                );
              }
              if (parent === 'numbered-list') {
                return (
                  <li parent={parent} {...attributes}>{children}</li>
                );
              }
            } else {
              return (
                <li {...attributes}>{children}</li>
              );
            }
          }
          case 'bulleted-list': {
              return (
                <ul>
                  {children}
                </ul>
              );
          }
          case 'numbered-list':
            return (
              <ol>
                {children}
              </ol>
            );
          case 'table': {
            const classname = obj.data.get('className') ? obj.data.get('className') : '';
            let style = obj.data.get('style');
            if (style) {
              return (
                <table {...attributes} className={classname} style={style}>
                  <tbody {...attributes}>{children}</tbody>
                </table>
              );
            } else {
              return (
                <table {...attributes} className={classname}>
                  <tbody {...attributes}>{children}</tbody>
                </table>
              );
            }
          }
          case 'table_row':
            return <tr {...attributes}>{children}</tr>;
          case 'table_cell':
              return <td {...attributes}>{children}</td>;
          case 'image': {
            const src = obj.data.get('src');
            const style = obj.data.get('style');
            return (
              <img
                {...attributes}
                src={src}
                style={style}
                className={css`
                  display: block;
                  box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
                `}
              />
            );
          }
          case 'embed': {
            let src = obj.data.get('src');
            let style = obj.data.get('style');
            if (style && src) {
              return (
                <iframe 
                src={src}
                style={style}
                className={css`
                display: block;
                max-height: 20em;
                box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
              `}
                allow="accelerometer"
                allowFullScreen
                />
              );
            }
          }
          case 'button': {
            let style = obj.data.get('style');
            let href = obj.data.get('href');
            let value = obj.data.get('value') ? obj.data.get('value') : obj.text;
            if(style && value){
              if (href) {
                return (
                  <button 
                  className={css`
                    max-height: 20em;
                    box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'}
                  `}
                  style={style} 
                  href={href}
                  onClick={() => window.open(href)}
                  {...attributes}
                  >
                    {value}
                  </button>
                );
              } else {
                return (
                  <button 
                  className={css`
                    max-height: 20em;
                    box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'}
                  `}
                  style={style} 
                  {...attributes}
                  >
                    {value}
                  </button>
                );
              }
            
            }
          }
          default:
            return <p align="left">{children}</p>;
        }
      }
      if (obj.object === 'inline') {
        switch (obj.type) {
          case 'image': {
            let src = obj.data.get('src');
            let style = obj.data.get('style');
            let float = obj.data.get('float');
              if (src) {
                if (style) {
                  return (
                    <img
                      {...attributes}
                      align={float}
                      src={src}
                      style={style}
                    />
                  );
                } 
            }
          }
          case 'link': {
            const href = obj.data.get('href');
            const style = obj.data.get('style');
            const text = obj.data.get('text');
            if (style) {
              return (
                <a {...attributes} href={href}>
                  {text}
                </a>
              );
            } else {
              return (
                <a {...attributes} href={href}>
                  {text}
                </a>
              );
            }
          }
          case 'emoji': {
            const style = obj.data.get('style');
            const value = obj.data.get('value');
            if (style) {
              return (
                <span style={style} {...attributes}>
                  {value}
                </span>
              );
            } else {
              return (
                <span {...attributes}>
                  {value}
                </span>
              );
            }
          }
          default:
            return <p align="left">{children}</p>;
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
          case 'underline':
            return <u {...attributes}>{children}</u>;
          case 'strikethrough':
            return <strike {...attributes}>{children}</strike>;
          default:
            return <p align="left">{children}</p>;
        }
      }
    },
  }
];

export const serializer = new Html({ rules: RULES });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: serializer.deserialize(initialValue),
      isOpenModal: false,
      modalType: '',
      // LINK
      linktext: '',
      linkhref: '',
      // TABLE
      cols: '',
      rows: '',
      classname: '',
      text: '',
      // IMAGE
      activeImg: {
        objid: '',
        url: ''
      },
      images: [],
      image: '',
      src: '',
      alt: '',
      isActive: false,
      // EMBED
      videolink: '',
      // BUTTONNAME
      buttonname: '',
      // BUTTON
      buttonbackground: '',
      buttontext: '',
      buttonhref: '',
      buttonvalue: '',
      // FONT
      fontsize: '17px',
      select: undefined,
    };
  }

  ref = editor => {
    this.editor = editor;
  };

  componentDidMount() {
    this.fontsizeGenerator(17, 40)
  }

  
  // toggleColor = (name, element) => {
  //   if (!element) {
  //     let el = document.getElementById(name)
  //     let style = el.style;
  //     if(style.backgroundColor === 'grey'){
  //       style.backgroundColor = 'green'
  //     } else {
  //       style.backgroundColor = 'grey'
  //     }
  //   } else if (element) {
  //     let style = element.props.style;
  //     if(style.backgroundColor === 'grey'){
  //       style.backgroundColor = 'green'
  //     } else {
  //       style.backgroundColor = 'grey'
  //     }
  //   }
  // }

  renderFontsizeOptions = (select) => {
    let font = document.getElementById('font');
    let fontbutton = document.getElementsByClassName('ow-wysiwyg-toolbar-group').item(0);
    if(font) {
      font.appendChild(select);
      fontbutton.appendChild(font);
    }
  } 

  fontsizeGenerator = (minsize, maxsize) => {
      let select = document.createElement('select');
      select.id = 'fontsize';
      select.className = 'ow-wysiwyg-toolbar-item';
      select.name = 'fontsize';
      select.value = this.state.fontsize;
      select.onchange = (e) => this.onChangeValue(e);
      let space = '       ';
      for (let i = minsize; i < maxsize + 1; i++ ) {
        let opt = document.createElement('option');
        opt.setAttribute('key', i);
        opt.value = i + 'px';
        opt.text = i;
          select.appendChild(opt);
      };
      this.renderFontsizeOptions(select);
  }

  onChangeFile = (e, event, name, type, inputFile) => {
    // let file = e.target.files[0];
    // this.setState({ file });
    this.onClickImage(file, event, name, type, inputFile);
    /// if you want to upload latter
  };

  onChangeValue = (e, type) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    if(name === 'fontsize'){
      if (value !== ''){
        this.setState({
          [name]: value
        }, () => this.onClickFontsize(value))
      }

      
    }
    if(name === 'image'){
      let newObj = {
        objid: "55",
        url: "https://d1hlpam123zqko.cloudfront.net/657/306/991/710003019-1qi5oe8-kdbkd8e1mmn3j0p/original/nzdfiamegykcsg.jpg",
      }
      this.setState((prevState) => ({
        images: [...prevState.images, newObj]
      }))
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  onClickText = (event, type, tag) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    const { document } = value;
    editor.insertText(tag);
  };

  onClickEmoji = (value) => {
    if (value) {
      let emojiObj = {
        object: 'inline',
        type: 'emoji',
        data: {
          fontsize: '20px',
          value: value
        },
      };
      this.editor.insertInline(emojiObj);
    }
  }

  onClickFontsize = (e) => {
    let windowSelection = window.getSelection();
    let element = this.editor.value.startBlock
    let startBlockType = element.type;
    let fontsize = this.state.fontsize;
    let focusBlockType = this.editor.value.focusBlock.type;
   
    let style = element.data.get('style');
    let newStyle = {};
    if (style && style !== {}) {
      for (const [key, value] of Object.entries(style)) {
        if(style[key] && isNaN(key)){
          newStyle[key] = style[key]
          if(key === 'fontSize'){
            newStyle['fontSize'] = fontsize
          }
        } else {
          newStyle['fontSize'] = fontsize
        }
      }
    } 
      newStyle['fontSize'] = fontsize
      if(windowSelection.type === 'Range'){
        this.editor.setBlocks({
          object: 'block',
          type: focusBlockType,
          data: {
            style: newStyle,
          },
        });
      } else if (style && style.fontSize !== fontsize) {
          this.editor.setBlocks({
            object: 'block',
            type: startBlockType, 
            data: {
              style: newStyle,
            },
            });
      }    
  }

  onClickButton = (buttonbackground, buttontext, buttonhref, buttonvalue) => {
    let align = this.editor.value.focusBlock.type.slice(6,  this.editor.value.startBlock.type.length);
    let style = {
      backgroundColor: buttonbackground,
      color: buttontext ? buttontext : 'black'
    }
    if (align) {
      if (align === 'left'){
        style['display'] = 'flex';
        style['marginRight'] = 'auto';
        style['textAlign'] = align
      }
      if (align === 'center'){
        style['margin'] = 'auto';
        style['display'] = 'flex';
        style['textAlign'] = align
      }
      if (align === 'right'){
        style['display'] = 'flex';
        style['marginLeft'] = 'auto';
        style['textAlign'] = align
      }
    }
    let buttonObj = {
      object: 'block',
      type: 'button',
      data: {
        style: style,
        value: buttonvalue,
        href: buttonhref,
      }
    };
    this.editor.insertBlock(buttonObj);
    this.editor.moveToEnd();
  }

  onClickTable = (col, row, classname, name) => {
    let newStyle = {};
    if (
      name === 'table_left' ||
      name === 'table_center' ||
      name === 'table_right'
    ) {
      let align = name.slice(6, name.length);
      let newStyle = {};
      if (align === 'left'){
        delete newStyle.margin
        newStyle['marginRight'] = 'auto';
        newStyle['marginLeft'] = '0px';
        newStyle['textAlign'] = align;
        newStyle['border'] = '1px solid black';
      }
      if (align === 'center'){
        newStyle['margin'] = '0 auto 0 auto';
        newStyle['textAlign'] = align;
        newStyle['border'] = '1px solid black';
      }
      if (align === 'right'){
        delete newStyle.margin
        newStyle['marginRight'] = '0px';
        newStyle['marginLeft'] = 'auto';
        newStyle['textAlign'] = align;
        newStyle['border'] = '1px solid black';
      }
      let tableObj = {
        object: 'block',
        type: 'table',
        nodes: [],
        data: {
          className: classname,
          style: newStyle
        }
      };
      let rows = [];
      for (let i = 0; i < row; i++) {
        let rowID = `row${i}`;
        let cell = [];
        for (let j = 0; j < col; j++) {
          let cellID = `cell${i}-${j}`;
          cell.push({
            object: 'block',
            type: 'table_cell',
            nodes: [
              {
                object: 'text',
                text: cellID,
              },
            ],
          });
        }
        rows.push({
          object: 'block',
          type: 'table_row',
          nodes: cell,
        });
      }
      tableObj.nodes = rows;
      this.editor.insertBlock(tableObj)
    } else {
      newStyle['marginRight'] = 'auto';
      newStyle['marginLeft'] = '0px';
      newStyle['textAlign'] = 'left';
      newStyle['border'] = '1px solid black';
      let tableObj = {
        object: 'block',
        type: 'table',
        nodes: [],
        data: {
          className: classname,
          style: newStyle
        }
      };
      let rows = [];
      for (let i = 0; i < row; i++) {
        let rowID = `row${i}`;
        let cell = [];
        for (let j = 0; j < col; j++) {
          let cellID = `cell${i}-${j}`;
          cell.push({
            object: 'block',
            type: 'table_cell',
            nodes: [
              {
                object: 'text',
                text: cellID,
              },
            ],
          });
        }
        rows.push({
          object: 'block',
          type: 'table_row',
          nodes: cell,
        });
      }
      tableObj.nodes = rows;
      this.editor.insertBlock(tableObj)
    }
  };

  toBase64 = (file, event) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    resolve(file, event)
  });

  onClickImage = (file, event, name, type) => {
    // this.toBase64(file, event).then((data) => {
    //   this.editor.command(insertImage(this.editor, data, type, this.state.buttonname, ''));
    // });
    this.editor.command(insertImage(this.editor, file, type, this.state.buttonname, ''));
  };

  getJsonFromUrl = (url) => {
    if(!url) url = location.search;
    var query = url.substr(1);
    var result = {};
    query.split("&").forEach((part) => {
      var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  onClickEmbed = (videolink) => {
    if (videolink.includes('youtube')) {
    let src = 'https://www.youtube.com/embed/' + this.getJsonFromUrl(new URL(videolink).search).v;
    let style = {
      width: "560px",
      height: "400px",
      frameBorder: "0px"
    }
    let align = this.editor.value.startBlock.type.slice(6, this.editor.value.startBlock.type.length);
    if (align) {
      if (align === 'left') {
        style['display'] = 'flex';
        style['marginLeft'] = '0px';
        style['marginRight'] = 'auto';
      }
      if (align === 'center') {
        style['display'] = 'flex';
        style['marginLeft'] = 'auto';
        style['marginRight'] = 'auto';
      }
      if (align === 'right') {
        style['display'] = 'flex';
        style['marginRight'] = '0px';
        style['marginLeft'] = 'auto';
      }
    }
    let embedObj = {
      object: 'block',
      type: 'embed',
      data: {
        src: src,
        style: style
      },
      isVoid: true
    }
    this.editor.insertBlock(embedObj);
    }
  }

  onImageLoading = () => {
    return [
      {
        objid: "1",
        url: "https://www.pauliinasiniauer.com/wp-content/uploads/2015/02/IMG_6912-916x687.jpg",
      },
      {
        objid: "2",
        url: "https://d1bvpoagx8hqbg.cloudfront.net/originals/nice-places-visit-riga-71f95d3fb7704fc95ba62f07a5201b25.jpg",
      },
      {
        objid: "3",
        url: "https://www.ytravelblog.com/wp-content/uploads/2018/04/places-to-visit-in-slovakia-europe-1.jpg",
      }
    ];
  };

  onImageUpload = (file) => {
    return {
      content: "",
      docname: "",
      mime: "",
      length: "",
      alt: ""
    };
  };

  onDropOrPaste = (event, editor, next) => {
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
  }

  onDropOrPaste = (event, editor, next) => {
    const target = editor.findEventRange(event);
    if (!target && event.type === 'drop') return next();

    const transfer = getEventTransfer(event);
    const { type, text, files } = transfer;

    if (type === 'text') {
      if (!isUrl(text)) return next();
      if (!isImage(text)) return next();
      editor.command(insertImage, text, target);
      return;
    }

    next();
  };

  onDropImage = (acceptedfiles) => {
    acceptedfiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        let files = {
          content: btoa(fileAsBinaryString),
          uploadDate: new Date(),
          docname: file.name,
          preview: file.preview,
          logo: false,
          mime: file.type || 'application/octet-stream',
          new: true,
          length: file.size,
          //id: Lib.Browser.uuidv4(),
        };
        console.log(files)
        this.setState({ image: files }, async () => { 
          this.onImageUpload(files);
          this.setState({ images: await this.onImageLoading() });
        });
      };
      reader.readAsBinaryString(file);
    });
  }

  onClickLink =(linkhref, linktext) => {
    const { editor } = this;
    let style = editor.value.startBlock.data.get('style');
    let markTypes = [];
    const href = linkhref;
    const text = linktext;
    let startKey = editor.value.startText.key;
    editor.value.startBlock.nodes.map(node => {
      if(node.marks){
        node.marks.map((item) => {
          markTypes.push(item);
        })
      }
    })
    editor.insertInline({
      object: 'inline',
      type: 'link',
      data: { 
        href: href,
        text: text
      },
      isVoid: true,
      marks: [],
      nodes: [{
        object: 'text',
        data: {
          style: style
        },
        text: text,
        marks: markTypes
      }]
    });
    // editor.removeMarkByKey(startKey, markTypes.length, markTypes.length, 'bold');
    editor.moveToEndOfBlock()
  };

  
  hasMark = (type, value) => {
    return value.startText.marks.some(mark => {
      if (mark.type === type){
        return mark
      } else {
        return null
      }
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

  onClickMark = (event, type, name) => {
    let hasMark = this.hasMark(name, this.editor.value);
    let marks = this.editor.value.startText.marks;
    if (hasMark) {
      marks.map(mark => {
        if (mark.type === name){
          this.editor.removeMark(mark)
        }
      }) 
    } else {
      this.editor.toggleMark(name)
    }
  };

  onClickBlock = (event, type, name, tag) => {
    event.preventDefault();
    const { editor } = this;
    const { value } = editor;
    let { blocks } = 'undefined';

    if (type === 'text') editor.insertText(tag);
    blocks = value.blocks.some(block => {
      // ALIGN
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
          let style = block.data.get('style');
          editor.setBlocks({
            object: 'block',
            type: name,
            data: {
              style: style,
              align: name.slice(6, name.length)
            }
          });
        } 
        if (
          name === 'heading-one' ||
          name === 'heading-two' ||
          name === 'heading-three' ||
          name === 'heading-four' ||
          name === 'heading-five'
        ) {
          let style = block.data.get('style');
          let align = block.type.slice(6, block.type.length);
          let newStyle = {};
          if (style && style !== {}){
            for (const [key, value] of Object.entries(style)) {
              newStyle[key] = style[key];
            }
          }
          delete newStyle.fontSize;
          newStyle['textAlign'] = align;
          editor.setBlocks({
            object: 'block',
            type: name,
            data: {
              style: newStyle
            }
          })
          .unwrapBlock('align-center')
          .unwrapBlock('align-left')
          .unwrapBlock('align-right')
        } 
        if (name === 'quote') {
          editor.setBlocks(name);
          editor.wrapBlock(block.type);
        } 
      }
      // HEADING
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
          let style = block.data.get('style');
          let newStyle = {};
          let align = '';
          for (const [key, value] of Object.entries(style)) {
            if (key === 'textAlign') {
              align = value
            }
            newStyle[key] = style[key];
          }
          delete newStyle.textAlign;
          editor
            .unwrapBlock('heading-one')
            .unwrapBlock('heading-two')
            .unwrapBlock('heading-three')
            .unwrapBlock('heading-four')
            .unwrapBlock('heading-five')
            .unwrapBlock('align-center')
            .unwrapBlock('align-left')
            .unwrapBlock('align-right')
            .setBlocks({
              object: 'block',
              type: `align-${align}`,
              data: {
                style: newStyle
              }
            })
        }
        if (
          name === 'align-center' ||
          name === 'align-right' ||
          name === 'align-left'
        ) {
          editor.unwrapBlock('align-center');
          editor.unwrapBlock('align-left');
          editor.unwrapBlock('align-right');
          let style = block.data.get('style');
          let align = name.slice(6, name.length);
          let newStyle = {};
          for (const [key, value] of Object.entries(style)) {
            newStyle[key] = style[key];
          }
          newStyle['textAlign'] = align;
          editor.setBlocks({
            object: 'block',
            type: block.type,
            data : {
              style: newStyle
            }
          });
        }
      }
      // LIST
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
            editor
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
            .unwrapBlock('list-item')
            .setBlocks('align-left');
          }
          // if (
          //   name === 'align-center' ||
          //   name === 'align-left' ||
          //   name === 'align-right'
          // ) {
          //   let align = name.slice(6, name.length);
          //   newStyle = {};
          //   if (align) {
          //     if (align === 'left') {
          //       newStyle['margin'] = '0px';
          //       newStyle['display'] = 'block';
          //       newStyle['paddingLeft'] = '40%';
          //       newStyle['paddingRight'] = '40%';
          //       newStyle['textAlign'] = align
          //     }
          //     if (align === 'center') {
          //       newStyle['margin'] = '0px';
          //       newStyle['display'] = 'block';
          //       newStyle['paddingLeft'] = '40%';
          //       newStyle['paddingRight'] = '40%';
          //       newStyle['textAlign'] = align
          //     }
          //     if (align === 'right') {
          //       newStyle['margin'] = '0px';
          //       newStyle['display'] = 'block';
          //       newStyle['paddingLeft'] = '40%';
          //       newStyle['paddingRight'] = '40%';
          //       newStyle['textAlign'] = align
          //     }
          //   }
          //   editor
          //   .unwrapBlock('align-center')
          //   .unwrapBlock('align-left')
          //   .unwrapBlock('align-right')
          //   .setBlocks(block.type)
          //   .wrapBlock(name)
          // } 
          // else {
          //   editor
          //   .unwrapBlock('bulleted-list')
          //   .unwrapBlock('numbered-list')
          //   .unwrapBlock('list-item')
          //   .setBlocks('align-left')
          // }
        } 
      if (
        block.type === 'align-left' ||
        block.type === 'align-center' ||
        block.type === 'align-right'
        ) {
        if (name === 'bulleted-list' || name === 'numbered-list') {
          editor
          .setBlocks({
            object: 'block',
            type: 'list-item',
            data: {
              parent: name
            }
          })
          .wrapBlock(name);
        } else {
          editor.setBlocks(name)
        }
      }
      // QUOTE
      if (block.type === 'quote') {
        if (
          name === 'align-center' ||
          name === 'align-left' ||
          name === 'align-right'
        ) {
          editor.setBlocks(name)
        }
        if (name === 'quote') {
          editor.unwrapBlock('align-center');
          editor.unwrapBlock('align-left');
          editor.unwrapBlock('align-right');
          editor.setBlocks('align-left');
        }
      }
      // IMAGE
      if (block.type === 'image') {
        if (
          name === 'align-center' ||
          name === 'align-left' ||
          name === 'align-right'
        ) {
          let style = block.data.get('style');
          let align = name.slice(6, name.length);
          let src = block.data.get('src');
          let newStyle = {};
          if (style !== {}) {
            for (const [key, value] of Object.entries(style)) {
              newStyle[key] = style[key]
              if (align) {
                delete newStyle.float
                if (align === 'left') {
                  delete newStyle.margin;
                  newStyle['marginLeft'] = '0px';
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'center') {
                  newStyle['marginLeft'] = 'auto';
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'right') {
                  delete newStyle.margin;
                  newStyle['marginRight'] = '0px';
                  newStyle['marginLeft'] = 'auto';
                }
              }
            }
            let newObj = {
              object: 'block',
              type: 'image',
              data: {
                style: newStyle,
                src: src
              }
            }
            editor.setBlocks(newObj)
          } 
        }
      }
      // EMBED
      if (block.type === 'embed') {
        if (
          name === 'align-left' ||
          name === 'align-right' ||
          name === 'align-center'
        ) {
          let align = name.slice(6, name.length);
          let style = block.data.get('style');
          let src = block.data.get('src');
          let newStyle = {};
          if (style !== {}) {
            for (const [key, value] of Object.entries(style)) {
              newStyle[key] = style[key]
              if (align) {
                if (align === 'left') {
                  delete newStyle.margin
                  newStyle['marginLeft'] = '0px';
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'center') {
                  newStyle['marginLeft'] = 'auto';
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'right') {
                  delete newStyle.margin
                  newStyle['marginRight'] = '0px';
                  newStyle['marginLeft'] = 'auto';
                }
              }
            }
          } 
          editor.setBlocks({
            object: 'block',
            type: 'embed',
            data: {
              style: newStyle,
              src: src
            }
          });
          }
          }

      // BUTTON
      if (block.type === 'button') {
        if (
          name === 'align-left' ||
          name === 'align-right' ||
          name === 'align-center'
        ) {
          let align = name.slice(6, name.length);
          let style = block.data.get('style');
          let href = block.data.get('href');
          let text = block.data.get('value') ? block.data.get('value') : block.text;
          let newStyle = {};
          if (style !== {}) {
            for (const [key, value] of Object.entries(style)) {
              newStyle[key] = style[key]
              if (align) {
                if (align === 'left') {
                  delete newStyle['marginLeft'];
                  delete newStyle.margin
                  newStyle['textAlign'] = align;
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'center') {
                  newStyle['textAlign'] = align;
                  newStyle['marginLeft'] = 'auto';
                  newStyle['marginRight'] = 'auto';
                }
                if (align === 'right') {
                  delete newStyle.margin
                  delete newStyle['marginRight'];
                  newStyle['textAlign'] = align;
                  newStyle['marginLeft'] = 'auto';
                }
              }
            }
          } 
          let buttonObj = {
            object: 'block',
            type: 'button',
            data: {
              style: newStyle,
              value: text,
              href: href
            }
          }
          editor.setBlocks(buttonObj);
        } 
      }
      // PARAGRAPH && DEFAULT
      if (block.type === 'paragraph') {
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
        editor.unwrapBlock('paragraph');
        if (
          name === 'heading-one' ||
          name === 'heading-two' ||
          name === 'heading-three' ||
          name === 'heading-four' ||
          name === 'heading-five'
        ) {
          editor.setBlocks(name);
        } if (
          name === 'align-left' ||
          name === 'align-right' ||
          name === 'align-center'
        ) {
          editor.setBlocks(name)
        } 
        if (name === 'bulleted-list' || name === 'numbered-list') {
          editor
          .setBlocks({
            object: 'block',
            type: 'list-item',
            data: {
              parent: name
            }
          })
          .wrapBlock(name);
        } else {
          let style = block.data.get('style');
          editor.setBlocks(name);
          editor.wrapBlock('align-left')
        }
      }

      return blocks;
    });
  };

  // onEnter = (event, editor, node, next, type) => {
  //   // event.preventDefault();
  //   // const { value } = editor;
  //   // editor.setBlocks('line-break');
  // };

  // onDelete = (event, editor, next) => {
  //   const { value } = editor;
  //   const { selection } = value;
  //   if (selection.end.offset !== value.startText.text.length) return next();
  // };

  // onBackspace = (event, editor, next) => {
  //   // event.preventDefault();
  //   const { value } = editor;
  //   const { selection } = value;
  //   if (selection.start.offset !== 0) return next();

  //   editor.delete();
  // };

  // onKeyDown = (event, editor, next) => {
  //   // Return with no changes if the keypress is not '&'
  //   if (event.key !== 'Enter') return next()

  //   // Prevent the ampersand character from being inserted.
  //   event.preventDefault()

  //   // Change the value by inserting 'and' at the cursor's position.
  //   // overflow-wrap:break-word;white-space:pre-wrap;word-wrap:break-word"
  //   let style = this.editor.value.previousBlock
  //   // delete style.overflowWrap;
  //   // delete style.whiteSpace;
  //   // delete style.wordWrap;
  //   // if(style.text === ''){
  //   //   style.
  //   // }
  //   editor.setBlocks({
  //     object: 'block',
  //     type: 'align-left',
  //     data: {
  //       style: {}
  //     }
  //   });
  //   editor.insertBlock('align-left')
  // }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underline':
        return <u {...attributes}>{children}</u>;
      case 'strikethrough':
        return <strike {...attributes}>{children}</strike>;
      default:
        return <p align="left">{children}</p>;
    }
  };

  renderBlock = (props, editor, next) => {
    const { attributes, children, node, isFocused } = props;
    switch (node.type) {
      case 'span':
        return <span {...attributes}>{children}</span>;
      case 'line-break':
        return <br />;
      case 'heading-one': {
        let style = node.data.get('style');
        if (style) {
          return <h1 style={style} {...attributes}>{children}</h1>;
        } else {
          return <h1 {...attributes}>{children}</h1>;
        }
      }
      case 'heading-two': {
        let style = node.data.get('style');
        if (style) {
          return <h2 style={style} {...attributes}>{children}</h2>;
        } else {
          return <h2 {...attributes}>{children}</h2>;
        }
      }
      case 'heading-three': {
        let style = node.data.get('style');
        if (style) {
          return <h3 style={style} {...attributes}>{children}</h3>;
        } else {
          return <h3 {...attributes}>{children}</h3>;
        }
      }
      case 'heading-four': {
        let style = node.data.get('style');
        if (style) {
          return <h4 style={style} {...attributes}>{children}</h4>;
        } else {
          return <h4 {...attributes}>{children}</h4>;
        }
      }
      case 'heading-five': {
        let style = node.data.get('style');
        if (style) {
          return <h5 style={style} {...attributes}>{children}</h5>;
        } else {
          return <h5 {...attributes}>{children}</h5>;
        }
      }
      case 'paragraph': {
        const style = node.data.get('style');
        if (style) {
          return(
            <p style={style} {...attributes}>{children}</p>
            );
        } else {
          return(
            <p {...attributes}>{children}</p>
            );
        }
      }
      case 'quote':
        return <q {...attributes}>{children}</q>;
      case 'align-left': {
        let style = node.data.get('style');
        if (style) {
          return (
            <p align="left" style={style}>
              {children}
            </p>
          );
        } else {
          return (
            <p align="left" {...attributes}>
              {children}
            </p>
          );
        }
      }
      case 'align-center': {
        let style = node.data.get('style');
        if (style) {
          return (
            <p align="center" style={style} {...attributes}>
              {children}
            </p>
          );
        } else {
          return (
            <p align="center" {...attributes}>
              {children}
            </p>
          );
        }
      }
      case 'align-right': {
        let style = node.data.get('style');
        if (style) {
          return (
            <p align="right" style={style} {...attributes}>
              {children}
            </p>
          );
        } else {
          return (
            <p align="right" {...attributes}>
              {children}
            </p>
          );
        }
      }
      case 'list-item': {
        let parent = node.data.get('parent');
        if (parent) {
          if (parent === 'bulleted-list') {
            return (
              <li parent={parent} {...attributes}>{children}</li>
            );
          }
          if (parent === 'numbered-list') {
            return (
              <li parent={parent} {...attributes}>{children}</li>
            );
          }
        } else {
          return (
            <li {...attributes}>{children}</li>
          );
        }
      }
      case 'bulleted-list': {
          return (
            <ul {...attributes}>
              {children}
            </ul>
          );
      }
      case 'numbered-list': {
        return (
          <ol {...attributes}>
            {children}
          </ol>
        );
      }
      case 'table': {
        const classname = node.data.get('className') ? node.data.get('className') : '';
        let style = node.data.get('style');
        if (style) {
          return (
            <table {...attributes} className={classname} style={style}>
              <tbody {...attributes}>{children}</tbody>
            </table>
          )
        } else {
          return (
            <table {...attributes} className={classname}>
              <tbody {...attributes}>{children}</tbody>
            </table>
          )
        }
      }
      case 'table_row':
        return <tr {...attributes}>{children}</tr>;
      case 'table_cell':
          return <td {...attributes}>{children}</td>;
      case 'image': {
          let style = node.data.get('style');
          const src = node.data.get('src');
          if (src) {
            if (style) {
              return (
                <img
                  {...attributes}
                  src={src}
                  style={style}
                  className={css`
                    display: block;
                    box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'}
                  `}
                />
              );
            } 
        }
      }
      case 'embed': {
        let src = node.data.get('src');
        let style = node.data.get('style');
        if (style) {
          return (
            <iframe
            src={src}
            style={style}
            className={css`
            display: block;
            max-height: 20em;
            box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
          `}
            allow="accelerometer"
            allowFullScreen
            />
          );
        }
      }
      case 'button': {
        let style = node.data.get('style');
        let value = node.data.get('value') ? node.data.get('value') : node.text;
        let href = node.data.get('href');
        if (style && value) {
          if (href) {
            return (
              <button
              className={css`
                max-height: 20em;
                box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'}
              `}
              style={style}
              href={href}
              onClick={() => window.open(href)}
              {...attributes}
              >
                {value}
              </button>
            );
          } else {
            return (
              <button
              className={css`
                box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'}
              `}
              style={style}
              {...attributes}
              >
                {value}
              </button>
            );
          }
         
        }
      }
      default:
        return <p align="left">{children}</p>;
    }
  };

  renderInline = (props, editor, next, type) => {
    const { attributes, children, node, isFocused } = props;
    switch (node.type) {
      // LINK
      case 'link': {
        const href = node.data.get('href');
        const style = node.data.get('style');
        const text = node.data.get('text');
        if (style) {
          return (
            <a {...attributes} href={href}>
              {text}
            </a>
          );
        } else {
          return (
            <a {...attributes} href={href}>
              {text}
            </a>
          );
        }
      }
      // EMOJI
      case 'emoji': {
        const style = node.data.get('style');
        const value = node.data.get('value');
        if (style) {
          return (
            <span style={style} {...attributes}>
              {value}
            </span>
          );
        } else {
          return (
            <span {...attributes}>
              {value}
            </span>
          );
        }
      }
      // FLOATED_IMAGE
      case 'image': {
        const src = node.data.get('src');
        const style = node.data.get('style');
        let float = node.data.get('float');
        return (
          <img
            {...attributes}
            align={float}
            src={src}
            style={style}
            className={css`
              display: block;
              box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
            `}
          />
        );
      }
      // DEFAULT
      default: {
        return <p align="left">{children}</p>;
      }
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isOpenModal: !prevState.isOpenModal
    }));
  }
  
  onClickModal = (type, name, e) => {
    this.setState({ modalType: type, buttonname: name } , async () => {
        if(type === 'image') {
            this.setState({ images: await this.onImageLoading() }, () => {
              this.toggleModal();
            }
          ); 
        } else {
          this.toggleModal();
        }
      }
    )
  }

  modalTitleChooser = (type) => {
    if(type) {
      if(type === 'link'){
        return "Link beszúrása";
      } else if(type === 'image'){
        return "Kép beszúrása";
      } else if(type === 'table'){
        return "Táblázat beszúrása";
      } else if(type === 'embed'){
        return "Videó beszúrása";
      } else if(type === 'button'){
        return "Gomb beszúrása";
      }
     } 
  }

  modalChooser = (type) => {
    if(type) {
      if(type === 'link'){
        return this.linkModal();
      } else if(type === 'image'){
        return this.imageModal();
      } else if(type === 'table'){
        return this.tableModal();
      } else if(type === 'embed'){
        return this.embedModal();
      } else if(type === 'button'){
        return this.buttonModal();
      } else if(type === 'emoji'){
        return this.emojiModal();
      }
     } 
  }

  
  linkModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label"> Kérem illesze be a linket! </label><br />
          <input className="ow-input ow-form-control" name="linkhref" id="linkhref" type="text" value={this.state.linkhref} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
        <label className="ow-label"> Kérem írja be a link szövegét! </label><br />
        <input className="ow-input ow-form-control" name="linktext" id="linktext" type="text" value={this.state.linktext} onChange={(e) => { this.onChangeValue(e) }} />
      </div>
    </div>
    )
  }

  showImages = () => {
    document.getElementById('file').click();
  }

  getActive = (id) => {
    let element = document.getElementById(id);
    let style = element.style;
    if (style.border === 'none') {
      style.border = '5px solid blue'
    } else {
      style.border = 'none'
    }
    this.state.images.forEach((item) => {
      if (item.objid !== id) {
        let otherElemeent = document.getElementById(item.objid);
        let style = otherElemeent.style;
        style.border = 'none'
      }
    })
  }

  imageModal = () => {
    return (
      <div className="ow-row">
        <div className="ow-col-6" style={{ height: 130, borderStyle: 'dashed', borderColor: 'darkgray' }} onClick={() => this.showImages()}>
          <label className="ow-label">{'Kép feltötése!'}</label>
          <input className="ow-input ow-form-control" type='file' id="file" name='image' onChange={(e) => this.onChangeValue(e)} onClick={() => this.showImages()} accept="image/*" style={{ display: 'none' }} />
        </div>
        {this.state.images.length !== 0 && (
          this.state.images.map((image) => {
            return (
              <div key={image.objid} id={image.objid} onClick={() => { this.setState({ activeImg: image }, () => this.getActive(image.objid)) } } className="ow-col-6" style={{ height: 130, border: 'none' }} >
                <img
                  src={image.url}
                  alt="photo"
                  style={{ maxWidth: '100%', maxHeight: '100%', minWidth: '100%'}}
                  key={image.url}
                />
              </div>
            )
          })
        )}
      </div>
    )
  }

  tableModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label"> Kérem adja be hány oszlopos táblázatot szeretne! </label><br />
          <input className="ow-input ow-form-control" name="cols" id="cols" type="text" value={this.state.cols} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label"> Kérem adja be hány soros táblázatot szeretne! </label><br />
          <input className="ow-input ow-form-control" name="rows" id="rows" type="text" value={this.state.rows} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label"> Kérem adja be a táblázat osztálynevét! </label><br />
          <input className="ow-input ow-form-control" name="classname" id="classname" type="text" value={this.state.classname} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
      </div>
    )
  }

  embedModal = () => {
    return (
      <div>
        <label className="ow-label"> Kérem illesze be a videó linkjét! </label><br />
        <input className="ow-input ow-form-control" name="videolink" id="videolink" type="text" value={this.state.videolink} onChange={(e) => { this.onChangeValue(e) }} />
      </div>
    )
  }

  buttonModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label"> Kérem válassza ki a gomb háttérszínét! </label><br />
          <input className="ow-input ow-form-control" name="buttonbackground" id="buttonbackground" type="color" value={this.state.buttonbackground} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label"> Kérem válassza ki a gomb betűszínét! </label><br />
          <input className="ow-input ow-form-control" name="buttontext" id="buttontext" type="color" value={this.state.buttontext} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label"> Kérem illessze be a gomb szövegét! </label><br />
          <input className="ow-input ow-form-control" name="buttonvalue" id="buttonvalue" type="text" value={this.state.buttonvalue} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label"> Kérem illessze be a gombhoz tartozó linket! </label><br />
          <input className="ow-input ow-form-control" name="buttonhref" id="buttonhref" type="text" value={this.state.buttonhref} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
    </div>
    )
  }

  renderEmojis = () => {
    return(
      <React.Fragment>
      {
      json.map(emoji => {
          return <button key={emoji.name} style={{ fontSize: '25px' }} onClick={() => { this.onClickEmoji(emoji.id); setTimeout(() => {this.toggleModal()}, 200)}}><span>{emoji.id}</span></button>
        })
      }
    </React.Fragment>
    );
  }

  emojiModal = () => {
    return (
      <div>
        {this.renderEmojis()}
      </div>
    )
  }

  renderModal = () => {
    return(
      <div className="ow-modal">
      <div className="ow-modal-body">
        <div className="ow-modal-content">
          <div className="ow-modal-header">
            {this.modalTitleChooser(this.state.modalType)}
          </div>
          {this.modalChooser(this.state.modalType)}
          <button className="ow-btn-success" 
            onMouseDown={() => { 
              this.onModalSubmit(this.state.modalType); 
              setTimeout(() => {
                this.toggleModal();
              }, 10); }}
            >
              OK
            </button>
            &nbsp;&nbsp;
            <button className="ow-btn-dismiss" onClick={this.toggleModal}>Mégse</button>
        </div>
      </div>
      </div>
    )
  }

  onModalSubmit = (type) => {
    if(type === 'link'){
      this.onClickLink(this.state.linkhref, this.state.linktext);
    }
    if(type === 'image'){
      return this.onClickImage(this.state.activeImg);
    }
    if(type === 'table'){
      return this.onClickTable(this.state.cols, this.state.rows, this.state.classname, this.state.buttonname);
    }
    if(type === 'embed'){
      return this.onClickEmbed(this.state.videolink);
    }
    if(type === 'button'){
      return this.onClickButton(this.state.buttonbackground, this.state.buttontext, this.state.buttonhref, this.state.buttonvalue);
    }
    if(type === 'emoji'){
      return this.onClickEmoji(this.state.emoji);
    }
  }

  render() {
    const { as: Component, className, role, children, ...props } = this.props;
    return (
      <React.Fragment>
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
              renderBlock: this.renderBlock,
              renderMark: this.renderMark,
              renderInline: this.renderInline,
              hasBlock: this.hasBlock,
              hasLinks: this.hasLinks,
              onClickBlock: this.onClickBlock,
              onClickMark: this.onClickMark,
              onDrop: this.onDropOrPaste,
              onPaste: this.onDropOrPaste,
              onClickLink: this.onClickLink,
              onClickText: this.onClickText,
              onClickImage: this.onClickImage,
              onClickTable: this.onClickTable,
              onChangeFile: this.onChangeFile,
              onClickEmbed: this.onClickEmbed,
              onClickModal: this.onClickModal,
              toggleModal: this.toggleModal,
              isOpenModal: this.state.isOpenModal,
              renderModal: this.renderModal,
              onClickFontsize: this.onClickFontsize,
              onChangeValue: this.onChangeValue,
              onKeyDown: this.onKeyDown
              // toggleColor: this.toggleColor
            }}
          >
            {children}
          </SharedAppContext.Provider>
        </Component>
        {this.state.isOpenModal ? this.renderModal() : ""}
        </React.Fragment>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export const SharedAppConsumer = SharedAppContext.Consumer;

export default App;
