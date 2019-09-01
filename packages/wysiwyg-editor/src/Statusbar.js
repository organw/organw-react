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

const Statusbar = ({ as: Component, className, children, ...props }) => {
    return (
        <Component
            {...props}
            className={classNames(
                className,
                'ow-wysiwyg-statusbar',
            )}
        >
            Statusbar
        </Component>
    );
};

Statusbar.propTypes = propTypes;
Statusbar.defaultProps = defaultProps;

export default Statusbar