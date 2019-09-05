import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SharedAppConsumer } from './App';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['block', 'mark', 'table', 'link', 'image']).isRequired,
  name: PropTypes.string,
  tag: PropTypes.string,
};

const defaultProps = {
  as: 'button',
  // tag: 'html',
};

const ToolbarItem = ({
  as: Component,
  tag: Tag,
  name,
  className,
  children,
  type,
  types,
  editor,
  next,
}) => {
  // console.log('Type', type);
  // console.log('Tag', tag);
  // console.log('Childen', children);
  // console.log('Component', Component);

  if (type === 'mark') {
    console.log('mark');
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
              <Tag> {children}</Tag>
            </Component>
          );
        }}
      </SharedAppConsumer>
    );
  }
  if (type === 'block') {
    console.log('block');
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
  if (name === 'image') {
    console.log('image');
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
    console.log('TABLE');
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

  if (type === 'link') {
    console.log('link');
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

  if (name === 'list-item' || 'bulleted-list || numbered-list') {
    console.log('link');
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
};

ToolbarItem.propTypes = propTypes;
ToolbarItem.defaultProps = defaultProps;

export default ToolbarItem;
