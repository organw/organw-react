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

const Menubar = ({ as: Component, className, children, customProp,...props }) => {
    console.log(customProp);
    return (
        <Component
            {...props}
            className={classNames(
                className,
                'ow-wysiwyg-menubar',
            )}
        >
            {children}
        </Component>
    );
};

Menubar.propTypes = propTypes;
Menubar.defaultProps = defaultProps;

export default Menubar