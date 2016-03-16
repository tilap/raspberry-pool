import React, { Component, PropTypes } from 'react';
import Header from './components/install/HeaderComponent';

export default class InstallView extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        setMeta: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    render() {
        this.context.setTitle('How to install raspberry client');
        this.context.setMeta('description', 'Install a raspberry to make it work with raspberry-pool');

        const { url } = this.props;
        return (<div>
            <Header />
            <div className="install-picture" />

            <div className="container-fixed">
                <h1 className="page-title">How to install raspberry-client on your raspberry ?</h1>

                <h2>1. Install raspbian</h2>

                <h2>2. Configure your new raspberry (optional)</h2>
                <pre>
                    {`curl ${url}/install-raspberry.sh | sh`}
                </pre>

                <h2>1. Install raspberry-client and dependencies (node, livestreamer, chromium...)</h2>
                <pre>
                    {`curl ${url}/install-client.sh | sh`}
                </pre>
            </div>
        </div>);
    }
}
