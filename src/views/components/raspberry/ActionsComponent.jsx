import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import actions from '../../raspberryActions';
import Spinner from '../SpinnerComponent';

export default class ActionsComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, sendAction } = this.props;

        if (!raspberries || !raspberries.length) {
            return <div className="actions" />;
        }

        const availableActions = actions
            .map(action => ({
                ...action,
                raspberries: raspberries.filter(r => r.online && action.isVisible(r)),
            }))
            .filter(action => action.raspberries.length > 0);

        if (!availableActions.length) {
            return <div className="actions" />;
        }

        return (<div className="actions dropdown button">
            Actions
            <ul className="list">
                {availableActions.map(action => (
                    <li key={action.value}
                        onClick={() => {
                            const raspberries = action.raspberries.filter(raspberry => !action.isInProgress(raspberry));
                            if (raspberries.length) {
                                return sendAction(raspberries, action.value);
                            }
                        }}
                    >
                        {action.name}
                        <Spinner active={!!raspberries.filter(raspberry => (
                            raspberry.actions && raspberry.actions[action.value] === 'sending' || action.isInProgress(raspberry)
                        )).length} />
                    </li>
                ))}
            </ul>
        </div>);
    }
}
