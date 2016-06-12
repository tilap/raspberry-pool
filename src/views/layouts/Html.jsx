import Html from 'fody-html-layout';

export default function HtmlLayout(props) {
    return <Html preBody={<div id="disconnected"><div>disconnected</div></div>} {...props} />;
}
