import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import RaspberryList from './components/RaspberryListComponent';
import UnknownRaspberryList from './components/UnknownRaspberryListComponent';
import * as raspberriesActions from './actions/raspberry';
import { on, off } from '../webSocket/index';

class IndexView extends Component {
    static propTypes = {
        registeredRaspberries: PropTypes.array.isRequired,
        unknownRaspberries: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    static contextTypes = {
        setTitle: PropTypes.func.isRequired,
        context: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.changeConfig = raspberriesActions.changeConfig.bind(null, props.dispatch);
        this.sendAction = raspberriesActions.sendAction.bind(null, props.dispatch);
        this.saveUnknown = raspberriesActions.saveUnknown.bind(null, props.dispatch);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        this._handlerUpdateAll = on('update-all', (raspberries) => {
            dispatch(raspberriesActions.updateAll(raspberries));
        });
        this._handlerAdd = on('raspberry:add', (raspberry) => {
            dispatch(raspberriesActions.add(raspberry));
        });
        this._handlerUpdate = on('raspberry:update', (raspberry) => {
            dispatch(raspberriesActions.update(raspberry));
        });
        this._handlerDelete = on('raspberry:delete', (id) => {
            dispatch(raspberriesActions.remove(id));
        });
    }

    componentWillUnmount() {
        off('update-all', this._handlerUpdateAll);
        off('raspberry:add', this._handlerAdd);
        off('raspberry:update', this._handlerUpdate);
        off('raspberry:delete', this._handlerDelete);
    }

    render() {
        const { unknownRaspberries, registeredRaspberries } = this.props;
        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return (<div>
            <UnknownRaspberryList
                raspberries={unknownRaspberries}
                saveUnknown={this.saveUnknown}
                sendAction={this.sendAction}
            />
            <RaspberryList
                raspberries={registeredRaspberries}
                changeConfig={this.changeConfig}
                sendAction={this.sendAction}
            />
        </div>);
    }
}

export default connect(({ raspberries }) => ({
    registeredRaspberries: raspberries.filter(r => r.registered),
    unknownRaspberries: raspberries.filter(r => !r.registered),
}))(IndexView);
