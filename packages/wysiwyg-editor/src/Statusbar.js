import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { SharedAppConsumer } from './App';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node,
  countWords: PropTypes.string,
};

const defaultProps = {
  as: 'div',
};

const Statusbar = ({ as: Component, className, children }) => {
  return (
    <SharedAppConsumer>
      {props => {
        return (
          <Component className="ow-wysiwyg-statusbar">
            <Component>Statusbar</Component>
            {children}
          </Component>
        );
      }}
    </SharedAppConsumer>
  );
};

Statusbar.propTypes = propTypes;
Statusbar.defaultProps = defaultProps;

export default Statusbar;
