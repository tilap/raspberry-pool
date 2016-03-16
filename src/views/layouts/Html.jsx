import React, { Component } from 'react';
import Html from 'fody-html-layout';

export default class HtmlLayout extends Component {
    render() {
        return <Html preBody={<div id="disconnected"><div>disconnected</div></div>} {...this.props} />;
    }
}
