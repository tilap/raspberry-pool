import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './components/HeaderComponent';
import RaspberryList from './components/RaspberryListComponent';
import UnknownRaspberryList from './components/UnknownRaspberryListComponent';
import * as raspberriesActions from './actions/raspberry';
import { isConnected, emit, on, off } from '../../websocket';

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
        this.changeConfig = (...args) => props.dispatch(raspberriesActions.changeConfig(...args));
        this.sendAction = (...args) => props.dispatch(raspberriesActions.sendAction(...args));
        this.registerUnknown = (...args) => props.dispatch(raspberriesActions.registerUnknown(...args));
    }

    componentDidMount() {
        const { dispatch } = this.props;
        if (isConnected()) {
            emit('subscribe:raspberries', ({ raspberries }) => {
                dispatch(raspberriesActions.updateAll(raspberries));
            });
        }
        this._handlerConnected = on('connect', () => {
            emit('subscribe:raspberries', ({ raspberries }) => {
                dispatch(raspberriesActions.updateAll(raspberries));
            });
        });
    }

    componentWillUnmount() {
        emit('unsubscribe:raspberries');
        off('connect', this._handlerConnected);
    }

    render() {
        const { unknownRaspberries, registeredRaspberries } = this.props;
        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return (<div>
            <Header
                raspberries={registeredRaspberries}
                sendAction={this.sendAction}
            />
            <UnknownRaspberryList
                raspberries={unknownRaspberries}
                offlineRaspberries={registeredRaspberries.filter(r => !r.online)}
                registerUnknown={this.registerUnknown}
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
