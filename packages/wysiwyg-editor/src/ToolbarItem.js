import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SharedAppConsumer } from './App';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf([
    'block',
    'mark',
    'table',
    'link',
    'image',
    'text',
    'align',
    'align-center',
    'align-right',
    'align-left',
    'embed',
    'modal',
    'emoji',
    'fontsize',
    'button',
    'float_left',
    'float_right'
  ]).isRequired,
  name: PropTypes.string,
  tag: PropTypes.string,
};

const defaultProps = {
  as: 'button',
  // tag: 'html',
};

const ToolbarItem = ({
  as: Component,
  tag,
  name,
  className,
  children,
  type,
  tooltip
}) => {
  const inputFile1 = useRef();
  const inputFile2 = useRef();
  const inputFile3 = useRef();

  // getNames = (name) => {
  //   let names = [];
  //   return (
  //     <SharedAppConsumer>
  //     {elements => {
  //         names.push(name);
  //         elements.names = names;
  //     }}
  //   </SharedAppConsumer>
  //   )
  // }
  // MARK
  if (type === 'mark') {
    return (
      <SharedAppConsumer>
        {propss => {
        //  const element = <span id={name} className="dot" style={{height:'10px', width:'10px', backgroundColor:'grey', borderRadius:'50%', display:'inline-block'}} />
        //  for (let i= 0; i < 1; i++){
        //   if (propss.value && propss.value.endBlock.type === name) {
        //     propss.toggleColor(name, element)
        //   }
        //  }
          return (
            <React.Fragment>
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickMark(event, type, name);
                // propss.toggleColor(name);
              }}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
            </React.Fragment>
          );
        }}
      </SharedAppConsumer>
    );
  }
  // BLOCK
  if (type === 'block') {
    if (name === 'heading-one' || name === 'heading-two' || name === 'heading-three' || name === 'heading-four' || name === 'heading-five') {
      return (
        <SharedAppConsumer>
          {propss => {
              // const element = <span id={name} className="dot" style={{height:'10px', width:'10px', backgroundColor:'grey', borderRadius:'50%', display:'inline-block'}} />
              // for (let i= 0; i < 1; i++){
              //   if (propss.value && propss.value.focusBlock.type === name) {
              //     propss.toggleColor(name, element)
              //   }
              //  }
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickBlock(event, type, name);
                  // propss.toggleColor(name);
                }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    } else {
      return (
        <SharedAppConsumer>
          {propss => {
            const isActive = propss.hasBlock(name);
            return (
              <Component
                active={toString(isActive)}
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickBlock(event, type, name);
                }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
  }
  // ALIGN
  if (type === 'align') {
    if (name === 'align-left') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickBlock(event, type, name);
                }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'align-center') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickBlock(event, type, name);
                }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'align-right') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickBlock(event, type, name);
                }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
  }
  // IMAGE
  if (type === 'image') {
    if (name === 'image') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <React.Fragment>
              <input
                type="file"
                id="imgupload1"
                style={{ display: 'none' }}
                ref={inputFile1}
                onChange={e =>
                  propss.onChangeFile(e, event, name, type, inputFile1)
                }
              />
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={(e) => propss.onClickModal(type, name)}
                // onMouseDown={event => {
                //   inputFile1.current.click();
                // }}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            </React.Fragment>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'float_left') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <React.Fragment>
                <input
                  type="file"
                  id="imgupload2"
                  style={{ display: 'none' }}
                  ref={inputFile2}
                  onChange={e =>
                    propss.onChangeFile(e, event, name, type, inputFile2)
                  }
                />
                <Component
                  className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                  onMouseDown={() => propss.onClickModal(type, name)}
                  data-toggle="tooltip"
                  title={tooltip}
                >
                  {children}
                </Component>
              </React.Fragment>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'float_right') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <React.Fragment>
                <input
                  type="file"
                  id="imgupload3"
                  style={{ display: 'none' }}
                  ref={inputFile3}
                  onChange={e =>
                    propss.onChangeFile(e, event, name, type, inputFile3)
                  }
                />
                <Component
                  className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                  onMouseDown={() => propss.onClickModal(type, name)}
                  data-toggle="tooltip"
                  title={tooltip}
                >
                  {children}
                </Component>
              </React.Fragment>
            );
          }}
        </SharedAppConsumer>
      );
    }
  }

  // EMBED
  if (type === 'embed') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={() => propss.onClickModal(type, name)}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  } 
  // FONTSIZE
    if (type === 'fontsize') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={(e) => {propss.onChangeValue(e, type);}}
                onClick={(e) => propss.onChangeValue(e, type)}
                id="font"
                data-toggle="tooltip"
                title={tooltip}
              >
                Betűméret&nbsp;
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    } 
  // TABLE
  if (type === 'table') {
    // NORMAL TABLE
    if (name === 'table') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={() => propss.onClickModal(type, name)}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    // TABLE ALIGNED LEFT
    if (name === 'table_left') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={() => propss.onClickModal(type, name)}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    // TABLE ALIGNED CENTER
    if (name === 'table_center') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={() => propss.onClickModal(type, name)}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    // TABLE ALIGNED RIGHT
    if (name === 'table_right') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={() => propss.onClickModal(type, name)}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
  }

  // BUTTON
  if (type === 'button') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={() => propss.onClickModal(type)}
                data-toggle="tooltip"
                title={tooltip}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      ); 
  }

  // EMOJI
  if (type === 'emoji') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={() => propss.onClickModal(type, name)}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }

  // // FONTSIZE
  // if (type === 'fontsize') {
  //   return (
  //     <SharedAppConsumer>
  //       {propss => {
  //         return (
  //           <Component
  //             className={classNames(className, 'ow-wysiwyg-toolbar-item')}
  //             onMouseDown={() => propss.onClickFontsize(type)}
  //           >
  //             {children}
  //           </Component>
  //         );
  //       }}
  //     </SharedAppConsumer>
  //   );
  // }

  // LINK
  if (type === 'link') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={() => propss.onClickModal(type)}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }
  // LIST
  if (
    name === 'list-item' ||
    name === 'bulleted-list' ||
    name === 'numbered-list'
  ) {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickBlock(event, name);
              }}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }
  // TEXT
  if (type === 'text') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickBlock(event, type, name, tag);
              }}
              data-toggle="tooltip"
              title={tooltip}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }
};

ToolbarItem.propTypes = propTypes;
ToolbarItem.defaultProps = defaultProps;

export default ToolbarItem;
