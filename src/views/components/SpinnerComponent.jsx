import React, { Component, PropTypes } from 'react';

export default class SpinnerComponent extends Component {
    static propTypes = {
        active: PropTypes.bool,
    };

    render() {
        return (<div className={`spinner${ this.props.active ? ' active' : ''}`}>
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>);
    }
}
