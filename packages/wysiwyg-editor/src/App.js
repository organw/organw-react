import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Value } from 'slate'
import initialValue from './defaultValue.json'

const propTypes = {
    className: PropTypes.string,
    as: PropTypes.elementType,
    role: PropTypes.string,
    children: PropTypes.node
};

const defaultProps = {
    as: 'div',
    role: 'application'
};

const SharedAppContext = React.createContext();

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: Value.fromJSON(initialValue)
        };
    }

    ref = editor => {
        this.editor = editor
    }

    onChange = ({ value }) => {
        this.setState({ value })
    }

    render() {
        const { as: Component, className, role, children, ...props } = this.props;

        return (
            <Component
                {...props}
                role={role}
                className={classNames(
                    className,
                    'ow-wysiwyg-app',
                )}
            >
                <SharedAppContext.Provider
                    value={{
                        value: this.state.value,
                        ref: this.ref,
                        onChange: this.onChange
                    }}
                >
                    {children}
                </SharedAppContext.Provider>
            </Component>
        );
    }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export const SharedAppConsumer = SharedAppContext.Consumer;
export default App
