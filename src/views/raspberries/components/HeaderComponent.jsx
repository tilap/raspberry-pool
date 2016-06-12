import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Actions from './raspberry/ActionsComponent';

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
                {this.context.context.t('raspberry-pool.title')}
            </div>
            <div className="right">
                <a className="button flat" href={this.context.context.urlGenerator('default', { action: 'install' })}>Install client</a>
                <Actions raspberries={raspberries} sendAction={sendAction} />
            </div>
        </header>);
    }
}
