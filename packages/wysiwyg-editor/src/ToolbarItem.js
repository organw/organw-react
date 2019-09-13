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
  if (type === 'block') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickBlock(event, type, name);
                console.log(type);
              }}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }

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

  if (name === 'image') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              onMouseDown={event => {
                propss.onClickImage(event, name);
              }}
            >
              {children}
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }

  if (type === 'table') {
    if (name === 'table') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={editor => {
                  propss.onInsertTable(editor);
                }}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'table-row') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onInsertRow(event, name);
                }}
              >
                {children}
              </Component>
            );
          }}
        </SharedAppConsumer>
      );
    }
    if (name === 'table-cell') {
      return (
        <SharedAppConsumer>
          {propss => {
            return (
              <Component
                className={classNames(className, 'ow-wysiwyg-toolbar-item')}
                onMouseDown={event => {
                  propss.onInsertColumn(event, name);
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

  if (type === 'link') {
    return (
      <SharedAppConsumer>
        {propss => {
          return (
            <Component
              className={classNames(className, 'ow-wysiwyg-toolbar-item')}
              // active={propss.hasLinks}
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
