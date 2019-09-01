import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
    className: PropTypes.string,
    as: PropTypes.elementType,
    children: PropTypes.node
  };
  
const defaultProps = {
    as: 'div',
};

const Toolbar = ({ as: Component, className, children, ...props }) => {
    return (
        <Component
            {...props}
            className={classNames(
                className,
                'ow-wysiwyg-toolbar',
            )}
        >
            {children}
        </Component>
    );
};

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;

export default Toolbar