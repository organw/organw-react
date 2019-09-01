import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
    className: PropTypes.string,
    as: PropTypes.elementType,
    children: PropTypes.node
  };
  
const defaultProps = {
    as: 'button',
};

const ToolbarItem = ({ as: Component, className, children, ...props }) => {
    return (
        <Component
            {...props}
            className={classNames(
                className,
                'ow-wysiwyg-toolbar-item',
            )}
        >
            {children}
        </Component>
    );
};

ToolbarItem.propTypes = propTypes;
ToolbarItem.defaultProps = defaultProps;

export default ToolbarItem