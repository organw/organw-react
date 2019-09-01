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

const ToolbarGroup = ({ as: Component, className, children, ...props }) => {
    return (
        <Component
            {...props}
            className={classNames(
                className,
                'ow-wysiwyg-toolbar-group',
            )}
        >
            {children}
        </Component>
    );
};

ToolbarGroup.propTypes = propTypes;
ToolbarGroup.defaultProps = defaultProps;

export default ToolbarGroup