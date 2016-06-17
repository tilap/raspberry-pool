import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Actions from './raspberry/ActionsComponent';
import T from 'react-alp-translate';
import Link from 'react-alp-link';

export default class HeaderComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array,
        sendAction: PropTypes.func.isRequired,
    };

    static contextTypes = {
        context: PropTypes.object.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, sendAction } = this.props;

        return (<header className="header">
            <div className="left">
                <T id="raspberry-pool.title" />
            </div>
            <div className="right">
                <Link to="default" params={{ action: 'install' }} className="button flat">
                    <T id="header.installClientLink" />
                </Link>
                <Actions raspberries={raspberries} sendAction={sendAction} />
            </div>
        </header>);
    }
}
