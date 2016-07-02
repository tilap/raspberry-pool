import { PropTypes } from 'react';

SpinnerComponent.propTypes = {
    active: PropTypes.bool,
};

export default function SpinnerComponent({ active }) {
    return (<div className={`spinner${active ? ' active' : ''}`}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
    </div>);
}
