import { PropTypes } from 'react';
import Link from 'react-alp-link';
import T from 'react-alp-translate';

HeaderComponent.contextTypes = {
    context: PropTypes.object.isRequired,
};

export default function HeaderComponent(props, { context }) {
    return (<header className="header">
        <div className="left">
            <T id="raspberry-pool.title" />
        </div>
        <div className="right">
            <Link to="home" className="button flat">Your raspberries</Link>
        </div>
    </header>);
}
