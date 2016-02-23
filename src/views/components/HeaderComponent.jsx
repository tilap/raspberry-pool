import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import actions from '../raspberryActions';

export default class HeaderComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        broadcastAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, broadcastAction } = this.props;

        const availableActions = actions
            .map(action => ({
                ...action,
                raspberries: raspberries.filter(r => r.online && action.isVisible(r)),
            }))
            .filter(action => action.raspberries.length > 0);

        return (<header className="header">
            {!availableActions.length ? '' :
                <div className="actions">
                    <div className="dropdown button">
                        Actions
                        <ul className="list">
                            {availableActions.map(action => (
                                <li key={action.value}
                                    onClick={() => broadcastAction(action.raspberries, action.value)}
                                >
                                    {action.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        </header>);
    }
}
