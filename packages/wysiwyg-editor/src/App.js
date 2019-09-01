import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

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

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            message: '',
        };
    }

    openSnackbar = message => {
        this.setState({
            message,
            isOpen: true,
        });
    };

    closeSnackbar = () => {
        this.setState({
            message: '',
            isOpen: false,
        });
    };

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
                        openSnackbar: this.openSnackbar,
                        closeSnackbar: this.closeSnackbar,
                        snackbarIsOpen: this.state.isOpen,
                        message: this.state.message,
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
