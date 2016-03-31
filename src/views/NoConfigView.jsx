import React, { Component, PropTypes } from 'react';
import SimpleLayout from './layouts/Simple';

export default class NoConfigView extends Component {
    static Layout = SimpleLayout;
    static propTypes = {
        url: PropTypes.string.isRequired,
        ip: PropTypes.string.isRequired,
    };

    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        setMeta: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    render() {
        this.context.setTitle('No Config');

        const { url, ip } = this.props;
        return (<div className="no-config">
            <div className="install-picture" />

            <div className="container-fixed">
                <h1 className="page-title">Not configured</h1>

                <p>Go to <a href={url}>{url}</a> to configure this raspberry</p>
                {!ip ? '' : <p className="ip">IP: {ip}</p>}
            </div>
        </div>);
    }
}
