import React, { Component, PropTypes } from 'react';

export default class HeaderComponent extends Component {
    static contextTypes = {
        context: PropTypes.object.isRequired,
    };

    render() {
        return (<header className="header">
            <div className="left">
                {this.context.context.t('raspberry-pool.title')}
            </div>
            <div className="right">
                <a className="button flat" href={this.context.context.urlGenerator('home')}>Your raspberries</a>
            </div>
        </header>);
    }
}
