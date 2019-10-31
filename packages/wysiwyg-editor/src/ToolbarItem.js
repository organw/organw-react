import React from 'react';
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
}) => {
  // MARK
  if (type === 'mark') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickMark(event, name);
              }}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }

  // BLOCK
  if (type === 'block') {
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
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
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
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickImage(event, name, type);
                }}
              >
                {children}
              </Component>
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
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickImage(event, name, type);
                }}
              >
                {children}
              </Component>
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
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onClickImage(event, name, type);
                }}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
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
                onMouseDown={event => {
                  propss.onClickTable(event, type, name);
                }}
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
                onMouseDown={event => {
                  propss.onClickTable(event, type, name);
                }}
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
                onMouseDown={event => {
                  propss.onClickTable(event, type, name);
                }}
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
                onMouseDown={event => {
                  propss.onClickTable(event, type, name);
                }}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
  }

  // LINK
  if (type === 'link') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickLink(event, name);
              }}
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
