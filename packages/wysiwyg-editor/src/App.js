import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes, { element, bool } from 'prop-types';
import classNames from 'classnames';
import Html from 'slate-html-serializer';
import { getEventTransfer, cloneFragment } from 'slate-react';
import { isKeyHotkey } from 'is-hotkey';
import { css } from 'emotion';
import imageExtensions from 'image-extensions';
import isUrl from 'is-url';
import DropZone from 'react-dropzone';
import './App.css'
import './simple-grid.css'

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
const isCodeHotkey = isKeyHotkey('mod+q');
const isStriketroughHotkey = isKeyHotkey('mod+s');

function wrapLink(editor, href) {
  editor.wrapInline({
    type: 'link',
    data: { href },
  });

  editor.moveToEnd();
}

function unwrapLink(editor) {
  editor.unwrapInline('link');
}

function insertImage(editor, file, type, name, target) {
  if (type === 'float_left' || type === 'float_right') {
    if (type === 'float_left') {
      let leftObj = {
        object: 'inline',
        type: 'float_left',
        isVoid: true,
        data: { file },
      };
      editor.insertInline(leftObj);
      editor.wrapInline('align-left');
    }
    if (type === 'float_right') {
      let rightObj = {
        object: 'inline',
        type: 'float_right',
        isVoid: true,
        data: { file }
      };
      editor.insertInline(rightObj);
      editor.wrapInline('align-right');
    }
  } else {
    editor.insertBlock({
      type: 'image',
      isVoid: true,
      data: { file },
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
  a: 'link'
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
            return <p>{children}</p>;
          case 'block-quote':
            return <blockquote>{children}</blockquote>;
          case 'heading-one':
            return <h1>{children}</h1>;
          case 'heading-two':
            return <h2>{children}</h2>;
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
            const src = obj.data.get('file');
            return (
              <img
                {...attributes}
                src={src}
                className={css`
                  display: inline;
                  float: left;
                  margin: 0 20px 20px 0;
                  max-width: 40%;
                  max-height: 20em;
                  box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
                `}
              />
            );
          }
          case 'align-left':
            return (
              <p align="left" style={{ textIndent: '2em' }} {...attributes}>
                {children}
              </p>
            );
          case 'align-center':
            return (
              <p align="center" style={{ textIndent: '2em' }} {...attributes}>
                {children}
              </p>
            );
          case 'align-right':
            return (
              <p align="right" style={{ textIndent: '2em' }} {...attributes}>
                {children}
              </p>
            );
          case 'table':
            const buttonbackground =  obj.data.get('buttonbackground') ? obj.data.get('buttonbackground') : '#FFFFFF'
            const buttontext = obj.data.get('buttontext') ? obj.data.get('buttontext') : '#000000'
            const classname = obj.data.get('className') ? obj.data.get('className') : '';
            if(classname === 'but') {
              return (
                <table {...attributes} className={classname} style={{ backgroundColor: buttonbackground, color: buttontext, border: '0px none transparent'  }}>
                  <tbody {...attributes}>{children}</tbody>
                </table>
              );
            } else {
              return (
                <table {...attributes} className={classname} style={{ backgroundColor: buttonbackground, color: buttontext }}>
                  <tbody {...attributes}>{children}</tbody>
                </table>
              );
            }
          case 'table-row':
            return <tr {...attributes}>{children}</tr>;
          case 'table-cell':
            return <td {...attributes}>{children}</td>;
          case 'embed':
            return (
            <iframe 
            className={css`
            display: block;
            margin: 0 20px 20px 0;
            max-width: 40%;
            max-height: 20em;
            box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
          `} 
          width="560" height=" 315" src={obj.data.get('src')} frameBorder="0" allow="accelerometer" allowFullScreen>

          </iframe>);
          default:
            return <p {...attributes}>{children}</p>;
        }
      }
      if (obj.object === 'inline') {
        switch (obj.type) {
          case 'float_left': {
            const src = obj.data.get('file');
            return (
              <img
                {...attributes}
                src={src}
                className={css`
                  display: inline;
                  float: left;
                  margin: 0 20px 20px 0;
                  max-width: 40%;
                  max-height: 20em;
                  box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
                `}
              />
            );
          }
          case 'float_right': {
            const src = obj.data.get('file');
            return (
              <img
                {...attributes}
                src={src}
                className={css`
                  display: inline;
                  float: left;
                  margin: 0 20px 20px 0;
                  max-width: 40%;
                  max-height: 20em;
                  box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
                `}
              />
            );
          }
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
        switch (obj.type) {
          case 'align-center': {
            return (
              <p
                align="center"
                style={{ textIndent: '2em' }}
                {...attributes}
                href={href}
              >
                {children}
              </p>
            );
          }
          case 'align-left': {
            return (
              <p
                align="left"
                style={{ textIndent: '2em' }}
                {...attributes}
                href={href}
              >
                {children}
              </p>
            );
          }
          case 'align-right': {
            return (
              <p
                align="right"
                style={{ textIndent: '2em' }}
                {...attributes}
                href={href}
              >
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
          case 'strikethrough':
            return <strike {...attributes}>{children}</strike>;
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
      isOpenModal: false,
      modalType: '',
      modalTitle: '',
      images: [],
      // LINK
      linktext: '',
      linkhref: '',
      // TABLE
      cols: '',
      rows: '',
      classname: '',
      // IMAGE
      activeImg: {
        objid: '',
        url: ''
      },
      image: '',
      src: '',
      alt: '',
      // EMBED
      videolink: '',
      // BUTTONNAME
      buttonname: '',
      // BUTTON
      buttonbackground: '',
      buttontext: ''
    };
  }
  ref = editor => {
    this.editor = editor;
  };

  onChangeFile = (e, event, name, type, inputFile) => {
    e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    this.setState({ file });
    this.onClickImage(file, event, name, type, inputFile);
    /// if you want to upload latter
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else if (isStriketroughHotkey(event)) {
      mark = 'strikethrough'
    }
     else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

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
        const src = node.data.get('file');
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
      case 'table':
        const buttonbackground =  node.data.get('buttonbackground') ? node.data.get('buttonbackground') : '#FFFFFF'
        const buttontext = node.data.get('buttontext') ? node.data.get('buttontext') : '#000000'
        const classname = node.data.get('className') ? node.data.get('className') : ''
        if(classname === 'but') {
          return (
            <table {...attributes} className={classname} style={{backgroundColor: buttonbackground, color: buttontext , border: '0px none transparent' }}>
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
      case 'table-row':
        return <tr {...attributes}>{children}</tr>;
      case 'table-cell':
        return <td {...attributes}>{children}</td>;
      case 'embed':
        return (
        <iframe className={css`
        display: block;
        margin: 0 20px 20px 0;
        max-width: 40%;
        max-height: 20em;
        box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
        `} 
        width="560" height=" 315" src={node.data.get('src')} frameBorder="0" allow="accelerometer" allowFullScreen></iframe>);
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
      case 'strikethrough':
        return <strike {...attributes}>{children}</strike>;
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

  onClickModal = (type, name) => {
    console.log('type', type)
    this.setState({ modalType: type, buttonname: name } , async () => {
        if(type === 'image') {
            this.setState({ images: await this.props.onImageLoading() }, () => {
              this.toggleModal();
            }
          ); 
        } else {
          this.toggleModal();
        }
      }
    )
  }

  toggleModal = (props) => {
    console.log('props', props)
    this.setState(prevState => ({
      isOpenModal: !prevState.isOpenModal
    }));
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
      }
     } 
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
                }, 200); }}
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

  buttonModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label">Háttérszín</label><br />
          <input className="ow-input ow-form-control" name="buttonbackground" id="buttonbackground" type="color" value={this.state.buttonbackground} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
        <label className="ow-label">Betűszín</label><br />
        <input className="ow-input ow-form-control" name="buttontext" id="buttontext" type="color" value={this.state.buttontext} onChange={(e) => { this.onChangeValue(e) }} />
      </div>
    </div>
    )
  }

  linkModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label">URL</label><br />
          <input name="linkhref" id="linkhref" type="text" value={this.state.linkhref} onChange={(e) => { this.onChangeValue(e) }} className="ow-form-control ow-input" />
        </div>
        <div>
        <label className="ow-label">Megjelenő szöveg</label><br />
        <input name="linktext" id="linktext" type="text" value={this.state.linktext} onChange={(e) => { this.onChangeValue(e) }} className="ow-input ow-form-control" />
      </div>
    </div>
    )
  }

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
          this.props.onImageUpload(files);
          this.setState({ images: await this.props.onImageLoading() });
        });
      };
      reader.readAsBinaryString(file);
    });
  }

  imageModal = () => {
    return (
      <div>
        <div>
            <div className="ow-row">
            <div className="ow-col-6" style={{ height: 130, borderStyle: 'dashed', borderColor: 'darkgray' }}>
                <DropZone id="formPlakat" onDrop={this.onDropImage} className="custom-dropzone" accept="image/*">
                  <div style={{ height: 130, width: '100%', textAlign: 'center' }}>
                    {'Kép feltötése!'}
                  </div>
                </DropZone>
              </div>
              {this.state.images.map((image) => {
                  return (
                    <div onClick={() => { this.setState({ activeImg: image })}} className="ow-col-6" style={(image.objid === this.state.activeImg.objid) ? { height: 130, border: '2px solid blue' } : { height: 130 }} key={image.objid} >
                      <img
                        src={image.url}
                        alt="photo"
                        style={{ maxWidth: '100%', maxHeight: '100%', minWidth: '100%' }}
                      />
                    </div>
                  )
                }
              )}
            </div>
          </div>
      </div>
    )
  }

  tableModal = () => {
    return (
      <div>
        <div>
          <label className="ow-label">Oszlopok száma</label><br />
          <input className="ow-input ow-form-control" name="cols" id="cols" type="text" value={this.state.cols} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label">Sorok száma</label><br />
          <input className="ow-input ow-form-control" name="rows" id="rows" type="text" value={this.state.rows} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
        <div>
          <label className="ow-label">CSS osztálynév</label><br />
          <input className="ow-input ow-form-control" name="classname" id="classname" type="text" value={this.state.classname} onChange={(e) => { this.onChangeValue(e) }} />
        </div>
      </div>
    )
  }

  embedModal = () => {
    return (
      <div>
        <label className="ow-label">URL</label><br />
        <input className="ow-input ow-form-control" name="videolink" id="videolink" type="text" value={this.state.videolink} onChange={(e) => { this.onChangeValue(e) }} />
      </div>
    )
  }

  onChangeValue = (e) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: value
    });
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
      return this.onClickButton(1, 1, this.state.buttonbackground, this.state.buttontext);
    }
  }


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
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.unwrapBlock('align-center');
            editor.setBlocks('paragraph');
          } else {
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
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.setBlocks(block.type);
            editor.wrapBlock(name);
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
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.setBlocks(block.type);
            editor.wrapBlock(name);
          } else {
            editor.unwrapBlock('bulleted-list');
            editor.unwrapBlock('numbered-list');
            editor.unwrapBlock('list-item');
            editor.setBlocks('paragraph');
          }
        }
        // IMAGE
        if (block.type === 'image') {
          if (
            name === 'align-center' ||
            name === 'align-left' ||
            name === 'align-right'
          ) {
            editor.setBlocks(block.type);
            editor.unwrapBlock('align-center');
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.wrapBlock(name);
          }
        }

         // EMBED
         if (
          block.type === 'embed'
        ) {
          if (
            name === 'align-left' ||
            name === 'align-right' ||
            name === 'align-center'
          ) {
            editor.unwrapBlock('align-left');
            editor.unwrapBlock('align-right');
            editor.unwrapBlock('align-center');
            editor.wrapBlock(name);
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
          editor.setBlocks(name);
        }

        return listTrue;
      });
    }
  };

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  onClickButton = (row, col, buttonbackground, buttontext) => {
    let tableObj = {
      object: 'block',
      type: 'table',
      nodes: [],
      data: {
        buttonbackground: buttonbackground,
        buttontext: buttontext, 
        className: 'but'
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
          type: 'table-cell',
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
        type: 'table-row',
        nodes: cell,
      });
    }

    tableObj.nodes = rows;

    if (
      name === 'table_left' ||
      name === 'table_center' ||
      name === 'table_right'
    ) {
      if (name === 'table_left') {
        let paraObj = {
          object: 'block',
          type: 'align-left',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
      if (name === 'table_center') {
        let paraObj = {
          object: 'block',
          type: 'align-center',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
      if (name === 'table_right') {
        let paraObj = {
          object: 'block',
          type: 'align-right',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
    } else {
      let paraObj = {
        object: 'block',
        type: 'paragraph',
        nodes: [tableObj],
      };

      this.editor.insertBlock(paraObj);
    }
  }

  onClickTable = (row, col, classname, name) => {

    let tableObj = {
      object: 'block',
      type: 'table',
      nodes: [],
      data: {
        className: classname
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
          type: 'table-cell',
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
        type: 'table-row',
        nodes: cell,
      });
    }

    tableObj.nodes = rows;

    if (
      name === 'table_left' ||
      name === 'table_center' ||
      name === 'table_right'
    ) {
      if (name === 'table_left') {
        let paraObj = {
          object: 'block',
          type: 'align-left',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
      if (name === 'table_center') {
        let paraObj = {
          object: 'block',
          type: 'align-center',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
      if (name === 'table_right') {
        let paraObj = {
          object: 'block',
          type: 'align-right',
          nodes: [tableObj],
        };
        this.editor.insertBlock(paraObj);
      }
    } else {
      let paraObj = {
        object: 'block',
        type: 'paragraph',
        nodes: [tableObj],
      };

      this.editor.insertBlock(paraObj);
    }
  };

  onClickImage = (file, event, type) => {
    // event.preventDefault();
    console.log(file)
    this.editor.command(insertImage(this.editor, file.url, type, name));
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
    let embedObj = {
      object: 'block',
      type: 'embed',
      data: {
        src: src
      }
    } 
    this.editor.insertBlock(embedObj);
    embedObj.data.src = src;
    }
  }

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

  onClickLink = (linkhref, linktext) => {

    const { editor } = this;
    const { value } = editor;
    const hasLinks = this.hasLinks();

    const href = linkhref;
    const text = linktext;

    editor.insertText(text);
    editor.moveFocusBackward(text.length)
    this.editor.wrapInline({
      type: 'link',
      data: { href },
    });
  
    editor.moveToEnd();
  };

  onClickMark = (event, type, name) => {
    event.preventDefault();
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

  // onKeyDown = (event, editor, next) => {
  //   const { value } = editor;
  //   const { document, selection } = value;
  //   const { start, isCollapsed } = selection;
  //   const startNode = document.getDescendant(start.key);

  //   switch (event.key) {
  //     case 'Backspace':
  //       return this.onBackspace(event, editor, next);
  //     case 'Delete':
  //       return this.onDelete(event, editor, next);
  //     case 'Enter':
  //       return this.onEnter(event, editor, next);
  //     default:
  //       return next();
  //   }
  // };

  onEnter = (event, editor, node, next, type) => {
    // event.preventDefault();
    const { value } = editor;
  };

  onDelete = (event, editor, next) => {
    const { value } = editor;
    const { selection } = value;
    if (selection.end.offset !== value.startText.text.length) return next();
  };

  onBackspace = (event, editor, next) => {
    // event.preventDefault();
    const { value } = editor;
    const { selection } = value;
    if (selection.start.offset !== 0) return next();

    editor.delete();
  };

  renderInline = (props, editor, next, type) => {
    const { attributes, children, node, isFocused } = props;
    switch (node.type) {
      // LINK
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href}>
            {children}
          </a>
        );
      }
      // FLOATED_IMAGE
      case 'float_left': {
        const src = node.data.get('file');
        return (
          <img
            {...attributes}
            src={src}
            className={css`
              display: inline;
              float: left;
              margin: 0 20px 20px 0;
              max-width: 40%;
              max-height: 20em;
              box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
            `}
          />
        );
      }
      case 'float_right': {
        const src = node.data.get('file');
        return (
          <img
            {...attributes}
            src={src}
            className={css`
              display: inline;
              float: right;
              margin: 0 20px 20px 0;
              max-width: 40%;
              max-height: 20em;
              box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
            `}
          />
        );
      }
      // DEFAULT
      default: {
        return next();
      }
    }
  };

  hasBlock = name => {
    const { value } = this.state;
    return value.blocks.some(node => node.type === name);
  };

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
              onKeyDown: this.onKeyDown,
              renderblock: this.renderBlock,
              rendermark: this.renderMark,
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
              renderinline: this.renderInline,
              onChangeFile: this.onChangeFile,
              onClickEmbed: this.onClickEmbed,
              onClickModal: this.onClickModal,
              toggleModal: this.toggleModal,
              isOpenModal: this.state.isOpenModal,
              renderModal: this.renderModal
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
