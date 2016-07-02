import React, { Component, PropTypes } from 'react';

export default class Html extends Component {
    static propTypes = {
        title: PropTypes.string,
        description: PropTypes.string,
        body: PropTypes.string.isRequired,
        preBody: PropTypes.element,
        postBody: PropTypes.element,
        context: PropTypes.object.isRequired,
    };

    static defaultProps = {
        title: '',
        description: '',
    };

    render() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <title>{this.props.title}</title>
                    <meta name="description" content={this.props.description} />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic" rel="stylesheet" type="text/css" />
                    <link rel="stylesheet" href="/index.css" />
                </head>
                <body>
                    {this.props.preBody}
                    <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }} />
                    {this.props.postBody}
                </body>
            </html>
        );
    }
}
