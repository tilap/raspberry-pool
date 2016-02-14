import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RaspberryList from './components/RaspberryListComponent';
import { updateAll, updateRaspberry, saveRaspberry, sendAction } from './actions/raspberry';
import { on, off } from '../websocket';

class IndexView extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.save = saveRaspberry.bind(null, props.dispatch);
        this.sendAction = sendAction.bind(null, props.dispatch);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        this._handlerUpdateAll = on('update all', ({ raspberries }) => {
            dispatch(updateAll(raspberries));
        });
        this._handlerOnline = on('raspberry online', ({ raspberry }) => {
            dispatch(updateRaspberry(raspberry));
        });
        this._handlerOffline = on('raspberry offline', ({ raspberry }) => {
            dispatch(updateRaspberry(raspberry));
        });
        this._handlerPatch = on('update raspberry', ({ raspberry }) => {
            dispatch(updateRaspberry(raspberry));
        });
    }

    componentWillUnmount() {
        off('update all', this._handlerUpdateAll);
        off('raspberry online', this._handlerOnline);
        off('raspberry offline', this._handlerOffline);
        off('update raspberry', this._handlerPatch);
    }

    render() {
        const { raspberries } = this.props;
        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return <RaspberryList raspberries={raspberries} save={this.save} sendAction={this.sendAction} />;
    }
}

export default connect(({ raspberries }) => ({ raspberries }))(IndexView);
