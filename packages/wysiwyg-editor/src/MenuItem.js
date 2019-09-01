import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
    className: PropTypes.string,
    as: PropTypes.elementType,
    children: PropTypes.node,
    role: PropTypes.string,
  };
  
const defaultProps = {
    as: 'button',
    role: 'menuitem'
};

const MenuItem = ({ as: Component, className, role, children, ...props }) => {
    return (
        <Component
            {...props}
            role={role}
            className={classNames(
                className,
                'ow-wysiwyg-menuitem',
            )}
        >
            {children}
        </Component>
    );
};

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default MenuItem