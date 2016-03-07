import React, { Component, PropTypes } from 'react';

export default class InstallView extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
    };

    render() {
        const { url } = this.props;
        return (<div>
            <div>Raspberries - picture</div>

            <pre>
                {`curl ${url}/install-client.sh | sh`}
            </pre>
        </div>);
    }
}
