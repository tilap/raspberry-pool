import { PropTypes } from 'react';
import Header from '../common/components/install/HeaderComponent';

InstallView.propTypes = {
    url: PropTypes.string.isRequired,
};

InstallView.contextTypes = {
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
};

export default function InstallView({ url }, { setTitle, setMeta }) {
    setTitle('How to install raspberry client');
    setMeta('description', 'Install a raspberry to make it work with raspberry-pool');

    return (<div>
        <Header />
        <div className="install-picture" />

        <div className="container-fixed">
            <h1 className="page-title">How to install raspberry-client on your raspberry ?</h1>

            <h2>1. Install raspbian (wheezy or jessie)</h2>

            <h2>2. Install your new raspberry</h2>
            <pre>
                {`curl ${url}/install-scripts/install-raspberry.sh | sh`}
            </pre>
        </div>
    </div>);
}
